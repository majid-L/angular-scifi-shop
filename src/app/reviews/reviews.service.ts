import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private _baseUrl = "https://taliphus.vercel.app/api";

  constructor(
    private _http: HttpClient
  ) { }

  getProductReviews(productId: number) {
    return this._http.get<ReviewsResponse>(
      `${this._baseUrl}/products/${productId}/reviews`
    );
  }

  getCustomerReviews(customerId: number) {
    return this._http.get<ReviewsResponse>(
      `${this._baseUrl}/customers/${customerId}/reviews`
    );
  }

  createReview(requestBody: NewReviewRequest) {
    return this._http.post<{ newReview: Review }>(
      `${this._baseUrl}/reviews`,
      requestBody,
      { withCredentials: true }
    );
  }

  updateReview(reviewId: number, requestBody: UpdateReviewRequest) {
    return this._http.put<{ updatedReview: Review }>(
      `${this._baseUrl}/reviews/${reviewId}`,
      requestBody,
      { withCredentials: true }
    );
  }

  deleteReview(reviewId: number) {
    return this._http.delete<{ deletedReview: Review }>(
      `${this._baseUrl}/reviews/${reviewId}`,
      { withCredentials: true }
    );
  }
}