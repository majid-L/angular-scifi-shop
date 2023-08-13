import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectCartItems, selectCartStatus, selectProducts, selectProductsStatus } from 'src/app/ngrx';
import { addToCart } from 'src/app/ngrx/cart/cart.actions';
import { loadProducts } from 'src/app/ngrx/products/products.actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[] | null> = this.store.select(selectProducts);
  productStatus$: Observable<Status> = this.store.select(selectProductsStatus);
  cartStatus$: Observable<Status> = this.store.select(selectCartStatus);
  cart$: Observable<CartItems | null> = this.store.select(selectCartItems);
  loggedInUserId: string | null = window.localStorage.getItem('userId');

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
	  this.store.dispatch(loadProducts());
  }

  addToCart(e: MouseEvent, productId: number) {
    this.store.dispatch(addToCart({ 
      productId,
      customerId: Number(this.loggedInUserId),
      quantity: 1
     }));
  }

  cartIncludesItem(cartItems: CartItem[] | null, productId: number) {
    return cartItems && cartItems.find(item => item.productId === productId);
  }
}