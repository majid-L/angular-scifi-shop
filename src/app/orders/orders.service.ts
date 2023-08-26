import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLoggedInUserId } from '../ngrx/auth/auth.feature';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private _url = "";

  constructor(
    private _http: HttpClient,
    private _store: Store<AppState>
  ) {
    this._store.select(selectLoggedInUserId).subscribe(userId => {
      this._url = `https://taliphus.vercel.app/api/customers/${userId}/orders`;
    });
  }

  getOrders() {
    return this._http.get<OrdersResponse>(
      this._url,
      { withCredentials: true }
    );
  }

  getSingleOrder(orderId: string) {
    return this._http.get<SingleOrderResponse>(
      `${this._url}/${orderId}`,
      { withCredentials: true }
    );
  }

  createOrder(newOrder: NewOrderRequest) {
    return this._http.post<NewOrderResponse>(
      this._url,
      newOrder,
      { withCredentials: true }
    );
  }

  updateOrder(requestBody: { status: string, orderId: number }) {
    return this._http.put<SingleOrderResponse>(
      `${this._url}/${requestBody.orderId}`,
      requestBody,
      { withCredentials: true }
    );
  }

  deleteOrder(orderId: number) {
    return this._http.delete<{ deletedOrder: SingleOrderResponse }>(
      `${this._url}/${orderId}`,
      { withCredentials: true }
    );
  }
}