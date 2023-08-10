import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = "https://taliphus.vercel.app/api";

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<ProductsResponse>(this.baseUrl + '/products');
  }
}
