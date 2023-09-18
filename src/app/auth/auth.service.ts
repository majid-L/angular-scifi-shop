import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private _http: HttpClient) { }

  loginOrSignup(requestBody: AuthCredentials, endpoint: "/login" | "/signup") {
    const response = this._http.post<{ customer: Customer }>(
      this.baseUrl + endpoint, 
      requestBody,
      this.httpOptions
    );

    return response;
  }

  authenticateWithSSO(requestBody: AuthCredentials) {
    const response = this._http.post<>
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