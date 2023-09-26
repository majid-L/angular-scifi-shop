import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectCart, selectCartTotal } from 'src/app/ngrx/cart/cart.feature';
import { addExpressCheckoutItem } from 'src/app/ngrx/orders/orders.actions';
import { selectExpressCheckoutItem } from 'src/app/ngrx/orders/orders.feature';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.sass']
})
export class OrderItemsComponent {
  readonly expressCheckoutItem$: Observable<ExpressCheckoutItem | null> =
    this._store.select(selectExpressCheckoutItem);
  readonly cart$: Observable<Cart | null> = 
    this._store.select(selectCart);
  readonly cartTotal$: Observable<number | undefined> = 
    this._store.select(selectCartTotal);
  expressCheckoutItem: ExpressCheckoutItem | null | undefined;
  private _subscription = Subscription.EMPTY;

  quantity = new FormControl();

  constructor(
    private _store: Store<AppState>
  ) { }

  ngOnInit() {
    this._subscription = this.expressCheckoutItem$.subscribe(item => {
      this.expressCheckoutItem = item;
      if (item) {
        this.quantity = new FormControl(item.quantity, [Validators.required, Validators.min(1), Validators.max(item.product.stock)]);
      }
    });
  }

  get expressCheckoutTotal() {
    return Number(this.expressCheckoutItem?.product.price) * (this.expressCheckoutItem?.quantity || 1);
  }
  
  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  updateQuantity() {
    this._store.dispatch(addExpressCheckoutItem({ 
      product: this.expressCheckoutItem!.product,
      quantity: this.quantity.value
    }));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
