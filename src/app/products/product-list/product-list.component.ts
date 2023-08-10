import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectProducts, selectStatus } from 'src/app/ngrx';
import { loadProducts } from 'src/app/ngrx/products/products.actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[] | null> = this.store.select(selectProducts);
  status$: Observable<Status> = this.store.select(selectStatus);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
	  this.store.dispatch(loadProducts());
  }
}