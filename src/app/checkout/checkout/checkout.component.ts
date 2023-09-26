import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
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
import { AccountService } from '../../account/account.service';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';

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
  private readonly _loggedInUserId$: Observable<string | number | null> = 
    this._store.select(selectLoggedInUserId);
    
  dataStream$ = combineLatest([
    this.expressCheckoutItem$, this.cartItemCount$, this.newOrder$, this._loggedInUserId$
  ]).pipe(map(([expressCheckoutItem, cartItemCount, newOrder, loggedInUserId]) => {
      return { expressCheckoutItem, cartItemCount, newOrder, loggedInUserId };
    })
  );
  private _loggedInUserId: string | number | undefined;
  private _subscription = Subscription.EMPTY;
  loading = true;
  orderStatus: "pending" | "completed" | undefined;

  expressCheckoutItem: ExpressCheckoutItem | null | undefined;
  stepperOrientation$: Observable<StepperOrientation>;
  billingAddressFormGroup = this._accountService.createAddressForm();
  shippingAddressFormGroup = this._accountService.createAddressForm();
  billingAddress: Address | null | undefined;
  shippingAddress: Address | null | undefined;
  visitedSteps: string[] = ["Order items"];
  useExisting = { billingAddress: false, shippingAddress: false };

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _store: Store<AppState>,
    private _accountService: AccountService) {
    this.stepperOrientation$ = this._breakpointObserver
      .observe('(min-width: 900px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this._subscription = this.dataStream$
      .subscribe(({ expressCheckoutItem, cartItemCount, newOrder, loggedInUserId }) => {
        if (loggedInUserId) {
          this._loggedInUserId = loggedInUserId;
        }
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
    this.useExisting[data.type!] = data.useExisting;
    this[data.type!] = data.address;
  }
  
  handleStepperChange(e: StepperSelectionEvent) {
    this.visitedSteps.push(e.selectedStep.label);
  }

  createOrder({ status, paymentMethod, total }: PaymentEvent) {
    this.orderStatus = status;
    const requestBody = {
      shippingAddress: this._accountService.removeEmptyFields<Address>(this.shippingAddress!),
      billingAddress: this._accountService.removeEmptyFields<Address>(this.billingAddress!),
      status,
      paymentMethod,
      total
    };

    if (this.expressCheckoutItem) {
      const item = {
        productId: this.expressCheckoutItem.product.id,
        price: Number(this.expressCheckoutItem.product.price),
        quantity: this.expressCheckoutItem.quantity
      };

      (requestBody as typeof requestBody & 
        { item: typeof item }
      ).item = item;
    }

    this._store.dispatch(createOrder({ 
      newOrder: requestBody,
      customerId: Number(this._loggedInUserId)
    }));
    this._store.dispatch(loadCart({ customerId: Number(this._loggedInUserId) }));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._store.dispatch(clearExpressCheckout())
  }
}