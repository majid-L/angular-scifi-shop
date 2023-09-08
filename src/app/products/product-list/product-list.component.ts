import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectActiveId, selectUpdateStatus } from 'src/app/ngrx/cart/cart.feature';
import { selectCategories, selectSuppliers } from 'src/app/ngrx/categories/categories.feature';
import { selectLoadStatus, selectProducts } from 'src/app/ngrx/products/products.feature';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[] | null> = this._store.select(selectProducts);
  categories$: Observable<Category[] | null> = this._store.select(selectCategories);
  suppliers$: Observable<Supplier[] | null> = this._store.select(selectSuppliers);
  productLoadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  cartUpdateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  activeId$: Observable<number> = this._store.select(selectActiveId);
  private _breakpointSubscription = Subscription.EMPTY;
  private _streamSubscription = Subscription.EMPTY;
  listDisplayStyle = "grid";
  showDisplayToggle = true;
  category: Category | null | undefined = null;
  supplier: Supplier | null | undefined = null;
  datastream$ = combineLatest([
    this.categories$, this.suppliers$, this._route.queryParamMap
  ]).pipe(map(([categories, suppliers, queryParamMap]) => ({
    categories, suppliers, queryParamMap
  })));

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    private _breakPointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this._breakpointSubscription = this._breakPointObserver
      .observe('(max-width: 880px)')
      .subscribe(({ matches }) => {
        if (matches) {
          this.listDisplayStyle = "grid";
          this.showDisplayToggle = false;
        } else {
          this.showDisplayToggle = true;
        }
      });

    this._streamSubscription = this.datastream$
      .subscribe(({ categories, suppliers, queryParamMap }) => {
        const categoryParam = queryParamMap.get("category");
        const supplierParam = queryParamMap.get("supplier");
        if (categoryParam && categories) {
          this.category = categories.find(category => category.name === categoryParam);
        } else if (!categoryParam) {
          this.category = null;
        }

        if (supplierParam && suppliers) {
          this.supplier = suppliers.find(supplier => supplier.name === supplierParam);
        } else if (!supplierParam) {
          this.supplier = null;
        }
      });
  }

  ngOnDestroy() {
    this._breakpointSubscription.unsubscribe();
    this._streamSubscription.unsubscribe();
  }

  get headerImageSrc() {
    return this.category ? 
      `assets/categories/${this.category.thumbnail}.svg` 
      : this.supplier ? 
      `assets/suppliers/${this.supplier.thumbnail}.svg` 
      : "assets/products.svg";
  }

  get productListClass() {
    return {
      "product-list": this.listDisplayStyle === 'list',
      "product-grid": this.listDisplayStyle === 'grid'
    };
  }

  toggleStyle(e: MatButtonToggleChange) {
    this.listDisplayStyle = e.value;
  }
}