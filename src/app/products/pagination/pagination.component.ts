import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadProducts } from 'src/app/ngrx/products/products.actions';
import { selectLoadStatus, selectPagination } from 'src/app/ngrx/products/products.feature';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent {
  @Output() toggleStyleEvent = new EventEmitter<MatButtonToggleChange>();
  @Input() showDisplayToggle = true;
  readonly pagination$: Observable<Pagination> = 
    this._store.select(selectPagination);
  readonly productsLoadStatus$: Observable<Status> = 
    this._store.select(selectLoadStatus)
  private _paginationSubscription = Subscription.EMPTY;
  private _routeSubscription = Subscription.EMPTY;
  public currentPage = 1;
  public currentLimit = 25;
  public orderBy = "id";
  public minPrice = 0;
  public maxPrice = 1e5;
  public category: string | undefined;
  public supplier: string | undefined;
  private _order = "ASC";
  private _hideOutOfStock = false;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._paginationSubscription = this.pagination$.subscribe(({ page }) => {
      this.currentPage = page;
    })

    this._routeSubscription = this._route.queryParamMap.subscribe(queryParamMap => {
      this.category = queryParamMap.get("category") || "";
      this.supplier = queryParamMap.get("supplier") || "";
      this._store.dispatch(loadProducts(this.queryParams));
    });
  }

  get queryParams(): ProductsUrlParams {
    return {
      page: this.currentPage,
      limit: this.currentLimit,
      orderBy: this.orderBy,
      order: this._order,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      hideOutOfStock: this._hideOutOfStock,
      category: this.category,
      supplier: this.supplier
    }
  }

  formatLabel(value: number) {
    return `£${value.toFixed(2)}`;
  }

  handlePageEvent(e: PageEvent) {
    const page = e.pageIndex + 1;
    if (page !== this.currentPage || e.pageSize !== this.currentLimit) {
      if (e.pageSize !== this.currentLimit) {
        this.currentLimit = e.pageSize;
      }
      this._store.dispatch(loadProducts({ ...this.queryParams, page }));
    }
  }

  emitStyleEvent(e: MatButtonToggleChange) {
    this.toggleStyleEvent.emit(e);
  }

  setOrderBy(e: MatSelectChange) {
    if (!e.value) return;
    this.orderBy = e.value;
    if (e.value === "bestsellers") {
      this._order = "DESC";
    }
    this._store.dispatch(loadProducts({ ...this.queryParams, orderBy: e.value }));
  }

  setOrder(e: MatRadioChange) {
    this._order = e.value;
    this._store.dispatch(loadProducts({ ...this.queryParams, order: e.value }));
  }

  setHideOutOfStock(e: MatSlideToggleChange) {
    this._hideOutOfStock = e.checked;
    this._store.dispatch(loadProducts({ ...this.queryParams, hideOutOfStock: e.checked }));
  }

  setPriceRange() {
    console.log(this.minPrice, this.maxPrice);
    this._store.dispatch(loadProducts(this.queryParams));
  }

  removeFilter() {
    
  }

  /*setMinPrice(value: number) {
    if (value !== this.minPrice) {
      this.minPrice = value;
      this._store.dispatch(loadProducts({ ...this.queryParams, minPrice: value }));
    }
  }

  setMaxPrice(value: number) {
    if (value !== this.maxPrice) {
      this.maxPrice = value;
      this._store.dispatch(loadProducts({ ...this.queryParams, maxPrice: value }));
    }
  }*/

  ngOnDestroy() {
    this._paginationSubscription.unsubscribe();
    this._routeSubscription.unsubscribe();
  }
}
