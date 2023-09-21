import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { authenticateWithSSO } from '../ngrx/auth/auth.actions';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = "https://taliphus.vercel.app/api";
  httpOptions = {
    headers: new HttpHeaders({ 
      "Content-Type": "application/json"
    }),
    observe: 'response' as 'response',
    withCredentials: true
  };

  constructor(
    private _http: HttpClient,
    private _store: Store<AppState>
  ) { }

  loginOrSignup(requestBody: AuthCredentials, endpoint: "/login" | "/signup") {
    const response = this._http.post<{ customer: Customer }>(
      this.baseUrl + endpoint, 
      requestBody,
      this.httpOptions
    );

    return response;
  }

  authenticateWithSSO(requestBody: OAuthCredentials) {
    const response = this._http.post<{ customer: Customer }>(
      this.baseUrl + "/sso", 
      requestBody,
      this.httpOptions
    );

    return response;
  }

  dispatchSocialLoginAction(user: SocialUser) {
    this._store.dispatch(authenticateWithSSO({
      requestBody: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        authId: user.id,
        provider: `${user.provider[0].toUpperCase()}${user.provider.slice(1).toLowerCase()}`,
        thumbnail: user.photoUrl
      },
      socialUser: user
    }));
  }

  logout() {
    const response = this._http.post<{ msg: string }>(
      this.baseUrl + '/logout',
      {},
      { withCredentials: true }
    );

    return response;
  }
}