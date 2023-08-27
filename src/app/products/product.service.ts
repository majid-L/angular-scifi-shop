import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = "https://taliphus.vercel.app/api";

  constructor(private _http: HttpClient) { }

  getProducts() {
    return this._http.get<ProductsResponse>(`${this.baseUrl}/products`);
  }

  getSingleProduct(productId: number) {
    return this._http.get<SingleProduct>(`${this.baseUrl}/products/${productId}`);
  }

  getProductFromOrderHistory(customerId: number, productId: number) {
    return this._http.get<OrderSearchResponse>(
      `${this.baseUrl}/customers/${customerId}/orders?productId=${productId}`,
      { withCredentials: true }
    );
  }
}