import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentIntent } from '@stripe/stripe-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private _http: HttpClient
  ) { }

  createPaymentIntent(amount: number): 
    Observable<{ paymentIntent: PaymentIntent }> {
    return this._http.post<{ paymentIntent: PaymentIntent }>(
      "https://taliphus.vercel.app/api/create-payment-intent",
      { amount }
    );
  }
}