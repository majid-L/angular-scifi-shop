import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, Subscription, EMPTY, combineLatest, map } from 'rxjs';
import { selectCart, selectActiveId, selectLoadStatus, selectUpdateStatus, selectCartTotal } from 'src/app/ngrx/cart/cart.feature';
import { clearCart, modifyQuantity, removeCartItem, updateActiveId } from 'src/app/ngrx/cart/cart.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.sass']
})
export class CartSidebarComponent implements AfterViewInit {
  @Input() events: Observable<void> = EMPTY;
  @Input() loggedInUserId: string | number | null | undefined;
  @ViewChild(MatSidenav) cart: MatSidenav | undefined;
  eventsSubscription: Subscription = Subscription.EMPTY;
  updateStatusSubscription: Subscription = Subscription.EMPTY;
  cart$: Observable<Cart | null> = this._store.select(selectCart);
  cartTotal$: Observable<number> = this._store.select(selectCartTotal);
  loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  updateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  activeId$: Observable<number> = this._store.select(selectActiveId);
  dataStream$ = combineLatest([this.loadStatus$, this.updateStatus$, this.activeId$]).pipe(
    map(([loadStatus, updateStatus, activeId]) => ({ loadStatus, updateStatus, activeId }))
  );
  showDescription: { [productId: number]: boolean } = {};
  showForm: { [productId: number]: boolean } = {};
  quantitiesSubscription: Subscription = Subscription.EMPTY;
  quantities: { [productId: number]: number } = {};

  constructor(
    private _store: Store<AppState>, 
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.quantitiesSubscription = this.cart$.subscribe(cart => {
      if (cart) {
        cart.cartItems.forEach(item => {
          this.quantities[item.product.id] = item.quantity;
        });
      }
    });

    this.updateStatusSubscription = this.updateStatus$.subscribe(updateStatus => {
      if (updateStatus === "success") {
        this._snackBar.open('Cart updated.', 'Dismiss', {
          horizontalPosition: "start",
          verticalPosition: "top",
          duration: 7000
        });
      }
    });
  }

  ngAfterViewInit() {
    this.eventsSubscription = this.events.subscribe(() => {
      this.cart?.open();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.quantitiesSubscription.unsubscribe();
  }

  modifyQuantity(productId: number, quantity: number) {
    this._store.dispatch(updateActiveId({ activeId: productId }));
    if (quantity === 0) {
      this._store.dispatch(removeCartItem({ 
        productId, 
        customerId: Number(this.loggedInUserId!) 
      }));
    } else {
      this._store.dispatch(modifyQuantity({ 
        productId, 
        quantity,
        customerId: Number(this.loggedInUserId!)
      }));
    }
  }

  deleteItem(productId: number) {
    this._store.dispatch(updateActiveId({ activeId: productId }));
    this._store.dispatch(removeCartItem({ 
      productId, 
      customerId: Number(this.loggedInUserId!) 
    }));
  }

  emptyCart() {
    this._store.dispatch(updateActiveId({ activeId: -1 }));
    this._store.dispatch(clearCart({ customerId: Number(this.loggedInUserId!) }));
  }

  toggleDescription(productId: number, show: boolean) {
    this.showDescription[productId] = show;
  }

  toggleForm(productId: number, show: boolean) {
    this.showForm[productId] = show;
  }
}