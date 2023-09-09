import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  baseUrl = "https://taliphus.vercel.app/api/customers";

  constructor(
    private _http: HttpClient
  ) { }

  getWishlistItems(customerId: number, format: string) {
    const options = {
      params: new HttpParams().append("format", format),
      withCredentials: true
    }
  
    return this._http.get<{ wishlist: Wishlist }>(
      `${this.baseUrl}/${customerId}/wishlist`,
      options
    );
  }

  updateWishlist(updatedWishlist: WishlistBasic, customerId: number) {
    return this._http.put<{ wishlist: Wishlist }>(
      `${this.baseUrl}/${customerId}/wishlist`,
      updatedWishlist,
      { withCredentials: true }
    );
  }
}
