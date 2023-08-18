import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  userId = window.localStorage.getItem('userId');
  endpointUrl = `https://taliphus.vercel.app/api/customers/${this.userId}/cart`;

  constructor(private http: HttpClient) { }

  getCart() {
    return this.http.get<{ cart: Cart }>(
      this.endpointUrl,
      { withCredentials: true }
    );
  }

  updateCart(updatedCart: CartItem[] | []) {
    return this.http.put<{ cart: Cart | [] }>(
      this.endpointUrl,
      updatedCart,
      { withCredentials: true }
    );
  }
}
