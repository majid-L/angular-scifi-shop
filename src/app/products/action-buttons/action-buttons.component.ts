import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addToCart, updateActiveId } from 'src/app/ngrx/cart/cart.actions';
import { selectCartItems } from 'src/app/ngrx/cart/cart.feature';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.sass']
})
export class ActionButtonsComponent {
  @Input() product: Product | undefined;
  private _loggedInUserId: string | null = window.localStorage.getItem('userId');
  readonly cart$: Observable<CartItem[] | [] | null> =
    this._store.select(selectCartItems);

  constructor(
    private _store: Store<AppState>,
    public dialog: MatDialog
  ) { }

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
    this._store.dispatch(updateActiveId({ activeId: this.product!.id }));
    this._store.dispatch(addToCart({ 
      productId: this.product!.id,
      customerId: Number(this._loggedInUserId),
      quantity: 1
     }));
  }

  cartIncludesItem(cartItems: CartItem[] | null) {
    return cartItems && cartItems.find(item => item.productId === this.product!.id);
  }
}