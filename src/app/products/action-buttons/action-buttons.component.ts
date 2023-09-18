import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { addToCart, removeCartItem, resetStatus, updateActiveId } from 'src/app/ngrx/cart/cart.actions';
import { selectCartItems } from 'src/app/ngrx/cart/cart.feature';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.sass']
})
export class ActionButtonsComponent {
  @Input() product: Product | undefined;
  readonly cart$: Observable<CartItem[] | [] | null> =
  this._store.select(selectCartItems);
  private readonly _loggedInUserId$: Observable<number | string | null> = 
    this._store.select(selectLoggedInUserId);
  private _loggedInUserId: string | number | null | undefined;
  private _subscription = Subscription.EMPTY;

  constructor(
    private _store: Store<AppState>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this._subscription = this._loggedInUserId$.subscribe(id => {
      if (id) {
        this._loggedInUserId = id;
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  showDialog() {
    const { id, name, price, stock, thumbnail } = this.product!;
    this.dialog.open(ProductDialogComponent, {
      data: { 
        productId: id, 
        productName: name, 
        productPrice: price, 
        stockLevel: stock, 
        thumbnail
      },
    });
  }

  addToCart() {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveId({ activeId: this.product!.id }));
    this._store.dispatch(addToCart({
      productId: this.product!.id,
      quantity: 1,
      customerId: Number(this._loggedInUserId)
    }));
  }

  removeFromCart() {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveId({ activeId: this.product!.id }));
    this._store.dispatch(removeCartItem({ 
      productId: this.product!.id, 
      customerId: Number(this._loggedInUserId) 
    }));
  }

  cartIncludesItem(cartItems: CartItem[] | null) {
    return cartItems && cartItems.find(item => item.productId === this.product!.id);
  }
}