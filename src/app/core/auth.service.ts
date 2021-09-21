import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../typings/user'
import { EncryptionService } from './encryption.service';
import { USER_ROUTES } from 'src/environments/routes';
import { retry } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


const TOKEN_KEY = 'presence';

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
    private cookie: CookieService
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

  async register(name: string, email: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      //const encrypted = await this.encryptionService.encryptRSA(user);

      this.http
        .post(USER_ROUTES.CREATE_USER(), {name: name, email: email, password: password})
        .pipe(retry(3))
        .toPromise()
        .then(
          (res: any) => {
            this.storeToken(res.bearer);
            this.user = res.user;
            resolve(this.user!);
          },
          (err) => {
            if (err.status > 500) {
              console.log(err)
            }
            reject(err);
          }
        );
    });
  }

  async login(email: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      // const encrypted = await this.encryptionService.encryptRSA({
      //   email,
      //   password,
      // });
      this.http
        .patch(USER_ROUTES.LOGIN(), {email: email, password: password})
        .pipe(retry(3))
        .toPromise()
        .then(
          (res: any) => {
            this.user = res.user;
            this.storeToken(res.bearer);
            resolve(this.user!);
          },
          (err) => {
            //Handled in component.
            reject(err);
          }
        );
    });
  }

  logout() {
    this.user = undefined;
    this.deleteToken();
  }

  private retrieveToken() {
    return this.cookie.get(TOKEN_KEY);
  }

  private storeToken(token: string) {
    if (token) {
      this.cookie.set(TOKEN_KEY, token, {
        path: '/',
        domain: environment.host,
        secure: false,
        sameSite: 'Lax',
      });
    }
  }

  private deleteToken() {
    // These parameters are now required by the library. The '/' is just so that we can access the cookie for our domain. We are not allowed to delete cookies from other domains
    this.cookie.delete('presence', '/', environment.host, false, 'Lax');
    // Since the cookie.delete doesn't seem to want to cooperate in prod I'm explicitly setting it to empty using good old fashioned JS
    document.cookie =
      'presence=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  public initHeaders() {
    const token = this.cookie.get(TOKEN_KEY);
    if (token !== null) {
      this.headers = new HttpHeaders().append(
        'Authorization',
        `${'Bearer ' + token}`
      );
    }
  }
}
