import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectActiveId, selectUpdateStatus } from 'src/app/ngrx/cart/cart.feature';
import { loadProducts } from 'src/app/ngrx/products/products.actions';
import { selectLoadStatus, selectProducts } from 'src/app/ngrx/products/products.feature';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[] | null> = this.store.select(selectProducts);
  productLoadStatus$: Observable<Status> = this.store.select(selectLoadStatus);
  cartUpdateStatus$: Observable<Status> = this.store.select(selectUpdateStatus);
  activeId$: Observable<number> = this.store.select(selectActiveId);

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
	  this.store.dispatch(loadProducts());
  }
}