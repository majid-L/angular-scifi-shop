import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = "https://taliphus.vercel.app/api";

  constructor(private _http: HttpClient) { }

  getProducts(queryParams: ProductsUrlParams) {
    const options = {
      params: new HttpParams().appendAll(queryParams)
    };
    
    return this._http.get<ProductsResponse>(`${this.baseUrl}/products`, options);
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

  getCategories() {
    return this._http.get<{ categories: Category[] }>(`${this.baseUrl}/categories`);
  }

  getSuppliers() {
    return this._http.get<{ suppliers: Supplier[] }>(`${this.baseUrl}/suppliers`);
  }
}