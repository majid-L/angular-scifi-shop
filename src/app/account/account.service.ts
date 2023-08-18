import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://taliphus.vercel.app/api/customers/";

  constructor(private http: HttpClient) { }

  getAccountData() {
    return this.http.get<Customer>(
      this.baseUrl + window.localStorage.getItem('userId'),
      { withCredentials: true }
    );
  }
}
