import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../entity/user';
import { EncryptionService } from './encryption.service';
import { USER_ROUTES } from '../../environments/routes';
import { CookieService } from 'ngx-cookie-service';
import { SnackbarService} from './snackbar.service';


const TOKEN_KEY = 'presence';
const SESSION_KEY = 'session';

type Optional<T> = T | undefined;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user?: User; // Do not set this directly, instead use the setter method
  private _status$: BehaviorSubject<Optional<User>> = new BehaviorSubject<
    Optional<User>
  >(undefined);
  public headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private cookie: CookieService,
    private snackbarService: SnackbarService
  ) { }

  set user(value: Optional<User>) {
    this._user = value;
    this._status$.next(value);
  }

  get user() {
    return this._user;
  }

  get status$() {
    return this._status$.asObservable();
  }

  async register(user: {
      email: string,
      name: string,
      password: string,
      organization: string,
      username: string
  }): Promise<User> {
    try {
      const encrypted = await this.encryptionService.encryptRSA(user);
      const res = await lastValueFrom(this.http
        .post<{bearer: string, user: User}>(USER_ROUTES.REGISTER(), {
          data:encrypted.data,
          publicKey: encrypted.publicKey
        }));
      this.storeToken(res.bearer as any);
      this.user = res!.user;
      return this.user!;
    } catch(e: any) {
      throw this.snackbarService.sendNotificationByError(e);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const encrypted = await this.encryptionService.encryptRSA({
        email,
        password,
      });
      const res: any = await lastValueFrom(this.http
        .post(USER_ROUTES.LOGIN(), encrypted));
      //delete auth header when there is a successul login
      this.headers = new HttpHeaders().delete('Authorization');
      this.user = res.user as User;
      this.storeToken(res.bearer);
      this.initHeaders();
      return this.user;
    } catch(e: any) {
      throw this.snackbarService.sendNotificationByError(e);
    }
  }

  logout() {
    this.deleteToken();
    this.clearAuthHeader();
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
   * Method to validate if a user is logged in
   *
   * @returns boolean weather a user has a token or not
   */
  public checkStatus(): Boolean {
    const token = this.retrieveToken();

    if(token) {
      // FIXME: verify token route needs to be implemented
      return true;
    } else {
      this.deleteToken();
      this.clearAuthHeader();
      return false;
    }
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
        domain: environment.host,
        secure: false,
        sameSite: 'Lax',
      });
    }
  }

  /**
   * Private method to enforce token removal when necessary
   */
  private deleteToken() {
    this.user = undefined;
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
