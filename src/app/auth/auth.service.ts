import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

type Res = {

}

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

  constructor(private http: HttpClient) { }

  signup(x: any) {
    console.log(x)
  }

  login(requestBody: AuthCredentials) {
    const response = this.http.post<{ customer: Customer }>(
      this.baseUrl + '/login', 
      requestBody,
      this.httpOptions
    );
    return response;
  }

  logout() {
    const response = this.http.post<{ msg: string }>(
      this.baseUrl + '/logout',
      {},
      { withCredentials: true }
    );

    return response;
  }
}