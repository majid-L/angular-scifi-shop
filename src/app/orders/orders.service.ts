import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private _url = "https://taliphus.vercel.app/api/customers";

  constructor(
    private _http: HttpClient
  ) { }

  getOrders(customerId: number) {
    return this._http.get<OrdersResponse>(
      `${this._url}/${customerId}/orders`,
      { withCredentials: true }
    );
  }

  getSingleOrder(orderId: string, customerId: number) {
    return this._http.get<SingleOrderResponse>(
      `${this._url}/${customerId}/orders/${orderId}`,
      { withCredentials: true }
    );
  }

  createOrder(newOrder: NewOrderRequest, customerId: number) {
    return this._http.post<NewOrderResponse>(
      `${this._url}/${customerId}/orders`,
      newOrder,
      { withCredentials: true }
    );
  }

  updateOrder(requestBody: { 
    status: string, 
    orderId: number,
    customerId: number
  }) {
    return this._http.put<SingleOrderResponse>(
      `${this._url}/${requestBody.customerId}/orders/${requestBody.orderId}`,
      requestBody,
      { withCredentials: true }
    );
  }

  deleteOrder(orderId: number, customerId: number) {
    return this._http.delete<{ deletedOrder: SingleOrderResponse }>(
      `${this._url}/${customerId}/orders/${orderId}`,
      { withCredentials: true }
    );
  }
}