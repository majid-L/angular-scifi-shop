import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { selectCart, selectActiveId, selectLoadStatus, selectUpdateStatus, selectCartTotal } from 'src/app/ngrx/cart/cart.feature';
import { clearCart, modifyQuantity, removeCartItem, resetStatus, updateActiveId } from 'src/app/ngrx/cart/cart.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass', '../cart-sidebar/cart-sidebar.component.sass']
})
export class CartComponent {
  @Input() component: "cart-page" | "cart-sidebar" | undefined;
  @Output() closeSidebarEvent = new EventEmitter();
  cart$: Observable<Cart | null> = this._store.select(selectCart);
  cartTotal$: Observable<number> = this._store.select(selectCartTotal);
  loggedInUserId$: Observable<string | number | null> = 
    this._store.select(selectLoggedInUserId);
  loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  updateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  activeId$: Observable<number> = this._store.select(selectActiveId);
  dataStream$ = combineLatest([
    this.cart$, this.cartTotal$, this.loadStatus$, this.updateStatus$, this.activeId$, this.loggedInUserId$
  ]).pipe(map(([cart, cartTotal, loadStatus, updateStatus, activeId, loggedInUserId]) => {
      return { cart, cartTotal, loadStatus, updateStatus, activeId, loggedInUserId };
    })
  );
  private _loggedInUserId: number | undefined;
  private _statusSubscription = Subscription.EMPTY;
  private _cartSubscription = Subscription.EMPTY;
  showDescription: { [productId: number]: boolean } = {};
  showForm: { [productId: number]: boolean } = {};
  quantities: { [productId: number]: number } = {};
  isSidebar: boolean | undefined;

  constructor(
    private _store: Store<AppState>, 
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isSidebar = this.component === "cart-sidebar";
    this._cartSubscription = this.dataStream$.subscribe(({ cart, loggedInUserId }) => {
      if (loggedInUserId) {
        this._loggedInUserId = Number(loggedInUserId);
      }

      if (cart) {
        cart.cartItems.forEach(item => {
          this.quantities[item.product.id] = item.quantity;
        });
      }
    });

    this._statusSubscription = this.dataStream$.subscribe(({ updateStatus }) => {
      if (updateStatus === "success") {
        this._snackBar.open('Cart updated.', 'Dismiss', {
          horizontalPosition: "start",
          verticalPosition: "top",
          duration: 7000
        });
      }
    });
  }

  emitSidebarCloseEvent() {
    this.closeSidebarEvent.emit();
  }

  ngOnDestroy() {
    this._cartSubscription.unsubscribe();
    this._statusSubscription.unsubscribe();
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  modifyQuantity(productId: number, quantity: number) {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveId({ activeId: productId }));
    if (quantity === 0) {
      this._store.dispatch(removeCartItem({ 
        productId, 
        customerId: this._loggedInUserId!
      }));
    } else {
      this._store.dispatch(modifyQuantity({ 
        productId, 
        quantity,
        customerId: this._loggedInUserId!
      }));
    }
  }

  deleteItem(productId: number) {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveId({ activeId: productId }));
    this._store.dispatch(removeCartItem({ 
      productId, 
      customerId: this._loggedInUserId!
    }));
  }

  emptyCart() {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveId({ activeId: -1 }));
    this._store.dispatch(clearCart({ customerId: this._loggedInUserId! }));
  }

  toggleDescription(productId: number, show: boolean) {
    this.showDescription[productId] = show;
  }

  toggleForm(productId: number, show: boolean) {
    this.showForm[productId] = show;
  }
}