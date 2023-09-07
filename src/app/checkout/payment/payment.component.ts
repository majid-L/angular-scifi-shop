import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, LOCALE_ID, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, Appearance, PaymentIntentResult, StripePaymentElementOptions, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { Store } from '@ngrx/store';
import { notify } from 'src/app/ngrx/notification/notification.actions';
import { selectCartTotal } from 'src/app/ngrx/cart/cart.feature';
import { FormBuilder, Validators } from '@angular/forms';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { CheckoutService } from '../checkout.service';
import { selectExpressCheckoutItem } from 'src/app/ngrx/orders/orders.feature';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass']
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent | undefined;
  @Input() billingAddress: Address | null | undefined;
  @Input() shippingAddress: Address | null | undefined;
  @Input() newOrderId: number | undefined;
  @Output() paymentEvent = new EventEmitter<PaymentEvent>();
  private readonly _accountData$: Observable<Customer | null> = 
    this._store.select(selectAccount);
  private readonly _cartTotal$: Observable<number> = 
    this._store.select(selectCartTotal);
  private readonly expressCheckoutItem$: Observable<ExpressCheckoutItem | null> =
    this._store.select(selectExpressCheckoutItem);
  private _subscription = Subscription.EMPTY;
  private _paymentSubscription = Subscription.EMPTY;
  //private _confirmPaymentIntent$: Observable<PaymentIntentResult> | undefined;
  private readonly _dataStream$ = combineLatest([
    this._accountData$, this._cartTotal$, this.expressCheckoutItem$
  ]).pipe(map(([accountData, cartTotal, expressCheckoutItem]) => {
    return { accountData, cartTotal, expressCheckoutItem }
  }));

  orderTotal = 0;
  elementsOptions: StripeElementsOptions = { locale: 'en' };
  paymentElementOptions: StripePaymentElementOptions = {
    business: { name: "Earl's Black Market" }
  };
  paymentMethod: "Card" | "Klarna" | "PayPal" | undefined;
  paying = false;
  status = "";

  paymentElementForm = this._formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email]]
  });

  appearance: Appearance = {
    theme: 'stripe',
    labels: 'floating',
    variables: {
      colorPrimary: '#673ab7',
    },
  };

  constructor(
    private _checkoutService: CheckoutService,
    private _formBuilder: FormBuilder,
    private _stripeService: StripeService,
    private _store: Store<AppState>,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit() {
    this.status = "loading";
    this._subscription = this._dataStream$
      .subscribe(({ accountData, cartTotal, expressCheckoutItem }) => {
        if (accountData) {
          this.paymentElementForm.patchValue({ 
            name: accountData.name,
            email: accountData.email || ''
          });
          
          this.paymentElementOptions.defaultValues = {
            billingDetails: {
              name: accountData.name,
              email: accountData.email
            }
          }
        }

        if (cartTotal || expressCheckoutItem) {
          if (cartTotal) {
            this.orderTotal = cartTotal;
          }
          if (expressCheckoutItem) {
            this.orderTotal = expressCheckoutItem.price * expressCheckoutItem.quantity;
          }
        
          this._checkoutService.createPaymentIntent(Math.round(this.orderTotal * 100))
            .subscribe(({ paymentIntent }) => {
              this.status = "success";
              this.elementsOptions.clientSecret = paymentIntent.client_secret!;
            });
        }
      });
  }

  handlePaymentMethodChange(e: StripePaymentElementChangeEvent) {
    switch (e.value.type) {
      case "card":
        this.paymentMethod = "Card";
        break;
      case "paypal":
        this.paymentMethod = "PayPal";
        break;
      case "klarna":
        this.paymentMethod = "Klarna";
        break;
    }
  }

  pay() {
    if (!this.shippingAddress || !this.billingAddress) {
      return this._store.dispatch(notify({ 
        title: "Address information is missing.", 
        content: "Billing and shipping addresses are required to complete your order." 
      }))
    }
    this.paying = true;
    if (this.paymentMethod !== "Card") {
      this.processNonCardPayment();
    } else if (this.paymentElementForm.valid) {
      this.processCardPayment();
    }
  }

  processCardPayment() {
    this._paymentSubscription = this._stripeService.confirmPayment({
      elements: this.paymentElement!.elements,
      redirect: 'if_required'
    }).subscribe((result: PaymentIntentResult) => {
        this.paying = false;
        if (result.error) {
          // Show error to the customer (e.g., insufficient funds)
          this._store.dispatch(notify({ title: "There was an error with the payment process.", content: result.error.message || "Unable to process your request." }));
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to the customer
            this._store.dispatch(notify({ 
              title: "Payment successful.", 
              content: `All done! Order total: ${formatCurrency(this.orderTotal, this.locale, '£')}. You will now be redirected to your new order.` 
            }));
            this.paymentEvent.emit({ 
              status: "completed", 
              paymentMethod: "Card",
              total: this.orderTotal
            });
          }
        }
    });
  }

  processNonCardPayment() {
    this.paymentEvent.emit({ 
      status: "pending", 
      paymentMethod: this.paymentMethod!,
      total: this.orderTotal
    });
  }

  ngOnChanges({ newOrderId }: { newOrderId: SimpleChange }) {
    if (newOrderId?.currentValue) {
      if (this.paymentMethod === "PayPal") {
        this._paymentSubscription = this._stripeService
          .confirmPayPalPayment(this.elementsOptions.clientSecret!, {
            return_url: `${window.location.origin}/orders/new?order_id=${this.newOrderId}&payment_method=PayPal`
          }).subscribe(() => {
            this.paying = false;
          });
      } else if (this.paymentMethod === "Klarna") {
        this._paymentSubscription = this._stripeService
          .confirmKlarnaPayment(this.elementsOptions.clientSecret!, {
            payment_method: {
              billing_details: {
                address: {
                  country: "GB"
                },
                email: "user-gb@example.com",
                phone: "01895808666"
              }
            },
            return_url: `${window.location.origin}/orders/new?order_id=${this.newOrderId}&payment_method=Klarna`
           }).subscribe(() => {
            this.paying = false;
          });
      }
    }
  }

  getErrorMessage() {
    const messages = { nameError: '', emailError: '' };
    if (this.paymentElementForm.controls.name.hasError('required')) {
      messages.nameError = 'You must enter a name.';
    }
    if (this.paymentElementForm.controls.email.hasError('email')) {
      messages.emailError = 'Email address must be valid.';
    }
    return messages;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._paymentSubscription.unsubscribe();
  }
}