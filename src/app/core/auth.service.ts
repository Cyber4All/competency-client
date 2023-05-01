import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, lastValueFrom, Observable, retry } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser, User, getUserGraphQuery } from '../../entity/user';
import { EncryptionService } from './encryption.service';
import { USER_ROUTES } from '../../environments/routes';
import { CookieService } from 'ngx-cookie-service';
import { basic_user_permissions, competencyAcl } from 'competency-acl';
import { SnackbarService} from './snackbar.service';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { GraphErrorHandler } from '../shared/functions/GraphErrorHandler';

const TOKEN_KEY = 'presence';

type Optional<T> = T | undefined;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user?: User; // Do not explicityly set a user, use the setter method
  private _isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isBetaUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public headers = new HttpHeaders();
  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private cookie: CookieService,
    private snackbarService: SnackbarService
  ) { }

  set user(value: Optional<User>) {
    this._user = value;
  }

  get isAdmin(): Observable<boolean>{
    return this._isAdmin.asObservable();
  }

  get isBetaUser(): Observable<boolean>{
    return this._isBetaUser.asObservable();
  }

  get user() {
    return this._user;
  }

  /**
   * Method to register new users
   *
   * @param user - object of user email, name, pwd, org, and username
   */
  async register(user: {
      email: string,
      name: string,
      password: string,
      organization: string,
      username: string
  }): Promise<void> {
    try {
      const encrypted = await this.encryptionService.encryptRSA(user);
      await lastValueFrom(this.http
        .post<{bearer: string, user: User}>(USER_ROUTES.REGISTER(), {
          data: encrypted.data,
          publicKey: encrypted.publicKey
        }))
        .then((res: any) => {
          this.user = res!.user;
          this.storeToken(res.bearer as any);
          this.initHeaders();
          return Promise.resolve();
        });
    } catch(e: any) {
      this.snackbarService.sendNotificationByError(e);
      throw this.formatError(e);
    }
  }

  /**
   * Method that allows a user to login
   *
   * @param email email of a users account trying to login
   * @param password pwd of users account trying to login
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const encrypted = await this.encryptionService.encryptRSA({
        email,
        password,
      });
      await lastValueFrom(this.http
        .post<{bearer: string, user: User}>(USER_ROUTES.LOGIN(), encrypted))
        .then((res: any) => {
          //delete auth header when there is a successul login
          this.headers = new HttpHeaders().delete('Authorization');
          this.user = res!.user;
          this.storeToken(res.bearer as any);
          this.initHeaders();
          return Promise.resolve();
        });
    } catch(e: any) {
     this.snackbarService.sendNotificationByError(e);
     throw this.formatError(e);
    }
  }

  logout() {
    this.deleteToken();
    this.clearAuthHeader();
  }

  /**
   * Retrieves a user by id
   *
   * @param id The id of the user to retrieve
   * @returns A user of type AuthUser
   */
  // TODO: Add the AuthUser return type
  async getUser(id: string): Promise<any> {
    const query = getUserGraphQuery(id);
    return await lastValueFrom(this.http
      .post(
        COMPETENCY_ROUTES.GRAPH_QUERY(),
        { query },
        { headers: this.headers, withCredentials: true, responseType: 'json' }
        ))
      .then((res: any) => {
        return res.data.user;
      })
      .catch((err) => {
        err = GraphErrorHandler.handleError(err);
        if (err) {
          this.snackbarService.sendNotificationByError(err);
        }
      });
  }

  /**
   * Public method to initialize headers for any route
   */
  public initHeaders() {
    const token = this.cookie.get(TOKEN_KEY);
    if (token !== null && token !== undefined && token !== '') {
      this.headers = new HttpHeaders().append(
        'Authorization',
        `${'Bearer ' + token}`
      );
    }
  }

  /**
   * Method to validate if an admin user is logged in
   */
  public async validateAdminAccess(): Promise <void> {
    const token = this.retrieveToken();
    const targetActions: string[] = [
      competencyAcl.competencies.reviewSubmitted,
      competencyAcl.lifecycle.deprecate,
      competencyAcl.lifecycle.reject,
      competencyAcl.lifecycle.approve
    ];

    await lastValueFrom(this.http
      .post(USER_ROUTES.VALIDATE_ACTIONS(), {token, targetActions}))
      .then((res: any) => {
        this._isAdmin.next(res.isValid);
      });
  }

  /**
   * Method to validate if a beta user is logged in
   */
  public async validateBetaAccess(): Promise <void> {
    const token = this.retrieveToken();
    const targetActions: string[] = basic_user_permissions;

    await lastValueFrom(this.http
      .post(USER_ROUTES.VALIDATE_ACTIONS(), {token, targetActions}))
      .then((res: any) => {
        this._isBetaUser.next(res.isValid);
      });
  }

  /**
   * Method to validate if a user is logged in
   *
   * @returns boolean weather a user has a token or not
   */
  public async checkStatus(): Promise<void> {
    const token = this.retrieveToken();
    if(token) {
      // And we already have a user; resolve
      if (this.user) {
        return Promise.resolve();
      }
      // No user; retrieve user
      this.initHeaders();
      await lastValueFrom(this.http
        .get<{user: User}>(
          USER_ROUTES.TOKEN(),
          { headers: this.headers, withCredentials: true, responseType: 'json' }
        ))
        .then((res: any) => {
          this.user = res!.user;
        })
        .catch(() => {
          // User token expired; logout
          this.deleteToken();
        })
        .finally(() => {
          return Promise.resolve();
        });
    } else {
      this.deleteToken();
      this.clearAuthHeader();
      return Promise.resolve();
    }
  }

  /**
   * Method to update a users password
   *
   * @param payload users new password
   * @param otaCode OTA code to reset password/user info
   */
  public async resetPassword(payload: string, otaCode: string): Promise<void> {
    this.initHeaders();
    await lastValueFrom(this.http
      .patch(USER_ROUTES.RESET_PASSWORD(otaCode), { payload }));
  }

  /**
   * Method to request a reset password email
   *
   * @param email email of user to send reset password email to
   */
  public async sendResetPassword(email: string): Promise<void>{
    this.initHeaders();
    await lastValueFrom(this.http
      .post(USER_ROUTES.SEND_RESET_PASSWORD(), { email }));
  }

  /**
   * Private method to retrieve the token value
   *
   * @returns the bearer token from the user signed in
   */
  private retrieveToken() {
    return this.cookie.get(TOKEN_KEY);
  }

  /**
   * Pirvate method to store a token in cookies
   *
   * @param token bearer token returned from service after succesful login
   */
  private storeToken(token: string) {
    if (token) {
      this.cookie.set(TOKEN_KEY, token, {
        expires: 1,
        path: '/',
        secure: false,
        sameSite: 'Lax',
      });
    }
  }

  /**
   * Private method to enforce token removal when necessary
   */
  private deleteToken() {
    // Explicitly clear any authenticated user vars
    this.user = undefined;
    this._isAdmin.next(false);
    this._isBetaUser.next(false);
    localStorage.removeItem('userId');
    /**
     * These parameters are now required by the library.
     * The '/' is just so that we can access the cookie for our domain.
     * We are not allowed to delete cookies from other domains
     */
    this.cookie.delete('presence', '/', environment.host, false, 'Lax');
    // Since the cookie.delete doesn't seem to want to cooperate in prod I'm explicitly setting it to empty using good old fashioned JS
    document.cookie =
      'presence=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  /**
   * Private method to format errors thrown
   *
   * @param e error caught by a function in auth.service
   * @returns formatted error
   */
  private formatError(e: any): { code: number, message: string } {
    if(e.error.message instanceof Array){
      return {
        code: 500,
        message: 'There was an error formatting your request.'
              +  ' Sorry for the inconvenience.'
              +  ' If the error persists, please email info@secured.team'
            };
    } else {
      return e.error;
    }
  }

  /**
   * This method clears the authorization header after the user logs out.
   * This prevents errors when the user logs out and attempts to log back in
   */
  private clearAuthHeader() {
    this.headers = new HttpHeaders().delete('Authorization');
  }
}
