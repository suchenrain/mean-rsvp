import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { BehaviorSubject, Subscription, of, timer } from 'rxjs';
import { AUTH_CONFIG } from './auth.config';
import { ENV } from '../core/env.config';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  // create Auth0 web auth instance
  private _auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  accessToken: string;
  userProfile: any;
  expiresAt: number;
  // create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  loggingIn: boolean;

  isAdmin: boolean;

  // subscribe to token expiration stream
  logoutSub: Subscription;

  get tokenValid(): boolean {
    // check if current time is past access token's expiration
    return Date.now() < JSON.parse(localStorage.getItem('expires_at'));
  }

  constructor(private router: Router) {
    // if app auth token is not expired, request new token
    if (JSON.parse(localStorage.getItem('expires_at')) > Date.now()) {
      this.renewToken();
    }
  }

  renewToken() {
    // check for valid Auth0 session
    this._auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken) {
        this._getProfile(authResult);
      } else {
        this._clearExpiration();
      }
    });
  }

  private _clearExpiration() {
    // remove token expiration from localStorage
    localStorage.removeItem('expires_at');
  }

  private _getProfile(authResult) {
    this.loggingIn = true;
    //use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this._setSession(authResult, profile);
        this._redirect();
      } else if (err) {
        console.error(`Error retrieving profile:${err.error}`);
      }
    });
  }

  private _setSession(authResult, profile?) {
    this.expiresAt = authResult.expiresIn * 1000 + Date.now();
    // store expiration in local storage to access in constructor
    localStorage.setItem('expires_at', JSON.stringify(this.expiresAt));
    this.accessToken = authResult.accessToken;
    this.userProfile = profile;

    // if initial login, set profile and admin information
    if (profile) {
      this.isAdmin = this._checkAdmin(profile);
    }
    //update login status in loggedIn$ stream
    this.setLoggedIn(true);
    this.loggingIn = false;

    // Schedule log out
    this.scheduleLogout();
  }

  scheduleLogout() {
    // if last token is expired, do nothing
    if (!this.tokenValid) {
      return;
    }
    // unsubscribe from previous expiration observable
    this.unscheduleLogout();

    // create and subscribe to expiration observable
    const expiresIn$ = of(this.expiresAt).pipe(
      mergeMap(expires => {
        const now = Date.now();

        //use timer to track delay until expiration
        // to log out at the proper time
        return timer(Math.max(1, expires - now));
      })
    );

    this.logoutSub = expiresIn$.subscribe(() => {
      this.logout();
    });
  }
  unscheduleLogout() {
    if (this.logoutSub) {
      this.logoutSub.unsubscribe();
    }
  }

  private _checkAdmin(profile) {
    // check if the user has admin role
    const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
    return roles.indexOf('admin') > -1;
  }

  setLoggedIn(value: boolean) {
    // update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  /**
   * authorize request
   * show the login page
   * @memberof AuthService
   */
  login() {
    // auth0 authorize request
    this._auth0.authorize();
  }

  logout() {
    // remove data from localStorage
    this._clearExpiration();
    this._clearRedirect();
    this.unscheduleLogout();
    // end auth0 authentication session
    this._auth0.logout({
      clientId: AUTH_CONFIG.CLIENT_ID,
      returnTo: ENV.BASE_URI
    });
  }
  /**
   * handle the authentication information
   * shoule be invoked in login() callback component
   * @memberof AuthService
   */
  handleAuth() {
    this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this._getProfile(authResult);
      } else if (err) {
        this._clearRedirect();
        this.router.navigate(['/']);
        console.error(`Error authenticating: ${err.error}`);
      }
    });
  }
  private _redirect() {
    // Redirect with or without 'tab' query parameter
    // Note: does not support additional params besides 'tab'
    const fullRedirect = decodeURI(localStorage.getItem('authRedirect'));
    const redirectArr = fullRedirect.split('?tab=');
    const navArr = [redirectArr[0] || '/'];
    const tabObj = redirectArr[1]
      ? { queryParams: { tab: redirectArr[1] } }
      : null;
    if (!tabObj) {
      this.router.navigate(navArr);
    } else {
      this.router.navigate(navArr, tabObj);
    }
    // Redirection completed; clear redirect from storage
    this._clearRedirect();
  }
  private _clearRedirect() {
    // remove redirect from localStorage
    localStorage.removeItem('authRedirect');
  }
}
