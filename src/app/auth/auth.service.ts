import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { authenticateWithSSO } from '../ngrx/auth/auth.actions';
import { SocialUser } from '@abacritt/angularx-social-login';
import { selectLoggedInUserId } from '../ngrx/auth/auth.feature';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private  _baseUrl = "https://taliphus.vercel.app/api";
  private _httpOptions = {
    headers: new HttpHeaders({ 
      "Content-Type": "application/json"
    }),
    observe: 'response' as 'response',
    withCredentials: true
  };
  public loggedInUserId: string | number | null = null;

  constructor(
    private _http: HttpClient,
    private _store: Store<AppState>
  ) {
    _store.select(selectLoggedInUserId).subscribe(id => {
      this.loggedInUserId = id;
    });
  }

  loginOrSignup(requestBody: AuthCredentials, endpoint: "/login" | "/signup") {
    const response = this._http.post<{ customer: Customer }>(
      this._baseUrl + endpoint, 
      requestBody,
      this._httpOptions
    );

    return response;
  }

  authenticateWithSSO(requestBody: OAuthCredentials) {
    const response = this._http.post<{ customer: Customer }>(
      this._baseUrl + "/sso", 
      requestBody,
      this._httpOptions
    );

    return response;
  }

  dispatchSocialLoginAction(user: SocialUser) {
    this._store.dispatch(authenticateWithSSO({
      requestBody: {
        name: user.name,
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
      this._baseUrl + '/logout',
      {},
      { withCredentials: true }
    );

    return response;
  }
}