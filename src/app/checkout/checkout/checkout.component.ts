import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectBillingAddress, selectShippingAddress } from 'src/app/ngrx/account/account.feature';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { clearExpressCheckout, createOrder } from 'src/app/ngrx/orders/orders.actions';
import { loadCart } from 'src/app/ngrx/cart/cart.actions';
import { selectExpressCheckoutItem, selectNewOrder } from 'src/app/ngrx/orders/orders.feature';
import { selectCartItemsCount } from 'src/app/ngrx/cart/cart.feature';
import { Router } from '@angular/router';

const addressFields = {
  addressLine1: ['', Validators.required],
  addressLine2: [''],
  city: ['', Validators.required],
  county: [''],
  postcode: ['', Validators.required]
};
const addressFieldsCopy: typeof addressFields =
  JSON.parse(JSON.stringify(addressFields));

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { 
      showError: true,
      displayDefaultIndicatorType: false
    }
  }]
})
export class CheckoutComponent {
  readonly shippingAddress$: Observable<Address | null | undefined> = 
    this._store.select(selectShippingAddress);
  readonly billingAddress$: Observable<Address | null | undefined> = 
    this._store.select(selectBillingAddress);
  readonly expressCheckoutItem$: Observable<ExpressCheckoutItem | null> =
    this._store.select(selectExpressCheckoutItem);
  readonly cartItemCount$: Observable<number | undefined> = 
    this._store.select(selectCartItemsCount);
  readonly newOrder$: Observable<NewOrderResponse | null> = 
    this._store.select(selectNewOrder);
    
  dataStream$ = combineLatest([
    this.expressCheckoutItem$, this.cartItemCount$, this.newOrder$
  ]).pipe(map(([expressCheckoutItem, cartItemCount, newOrder]) => {
      return { expressCheckoutItem, cartItemCount, newOrder };
    })
  );
  private _subscription = Subscription.EMPTY;
  loading = true;
  orderStatus: "pending" | "completed" | undefined;

  private expressCheckoutItem: ExpressCheckoutItem | null | undefined;
  stepperOrientation$: Observable<StepperOrientation>;
  billingAddressFormGroup = this._formBuilder.group(addressFields);
  shippingAddressFormGroup = this._formBuilder.group(addressFieldsCopy);
  billingAddress: Address | null | undefined;
  shippingAddress: Address | null | undefined;
  visitedSteps: string[] = ["Billing address"];
  useExisting = { billingAddress: false, shippingAddress: false };

  constructor(
    private _formBuilder: FormBuilder,
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _store: Store<AppState>) {
    this.stepperOrientation$ = this._breakpointObserver
      .observe('(min-width: 900px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this._subscription = this.dataStream$
      .subscribe(({ expressCheckoutItem, cartItemCount, newOrder }) => {
        if (newOrder && this.orderStatus === "completed") {
          this._router.navigateByUrl(`/orders/${newOrder.id}`);
        }
        if (cartItemCount !== undefined) {
          if (!expressCheckoutItem && cartItemCount === 0) {
            this._router.navigate(['/']);
          }
          this.loading = false;
        }
        this.expressCheckoutItem = expressCheckoutItem!;
      });
  }

  useAddress(data: AddressEmitData) {
    this.useExisting[data.type!] = true;
    this[data.type!] = data.address;
  }
  
  handleStepperChange(e: StepperSelectionEvent) {
    this.visitedSteps.push(e.selectedStep.label);
  }

  createOrder({ status, paymentMethod, total }: PaymentEvent) {
   // if (paymentEvent.status === "success") {
    this.orderStatus = status;
    const requestBody = {
      shippingAddress: this.shippingAddress!,
      billingAddress: this.billingAddress!,
      status,
      paymentMethod,
      total
    };

    if (this.expressCheckoutItem) {
      (requestBody as typeof requestBody & 
        { item: ExpressCheckoutItem }
      ).item = this.expressCheckoutItem!;
    }

    this._store.dispatch(createOrder(requestBody));
    this._store.dispatch(loadCart());
    //}
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._store.dispatch(clearExpressCheckout())
  }
}