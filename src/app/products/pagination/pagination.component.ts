import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadProducts } from 'src/app/ngrx/products/products.actions';
import { selectLoadStatus, selectPagination, selectProducts } from 'src/app/ngrx/products/products.feature';

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
    this._store.select(selectLoadStatus);
  readonly products$: Observable<Product[] | null> = 
    this._store.select(selectProducts);
  private _paginationSubscription = Subscription.EMPTY;
  private _routeSubscription = Subscription.EMPTY;
  public currentPage = 1;
  public currentLimit = 25;
  public orderBy = "id";
  public minPrice = 0;
  public maxPrice = 1e5;
  public category: string | undefined;
  public supplier: string | undefined;
  public queryParams: ProductsUrlParams = {} as ProductsUrlParams;
  public activeFilters: ProductsUrlParams = {} as ProductsUrlParams;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._paginationSubscription = this.pagination$.subscribe(({ page }) => {
      this.currentPage = page;
    });

    this._routeSubscription = this._route.queryParamMap.subscribe(queryParamMap => {
      this.queryParams = Object.create(queryParamMap).params;
      this.activeFilters = this.selectFilters(Object.create(queryParamMap).params);
      this.category = queryParamMap.get("category") || "";
      this.supplier = queryParamMap.get("supplier") || "";
      this._store.dispatch(loadProducts(this.queryParams));
    });
  }

  get showFilters() {
    return Object.keys(this.activeFilters).length !== 0;
  }

  get accentColor(): ThemePalette {
    return document.body.classList.contains("light-mode") ? "primary" : "accent";
  }

  selectFilters({ page, limit, ...props}: ProductsUrlParams) {
    const params: ProductsUrlParams = { ...props };
    if (page && Number(page) > 1) params.page = page;
    if (limit && Number(limit) !== 25) params.limit = limit;
    return params;
  }

  removeFilter(param: string) {
    this.updateUrlQueryParams({ [param]: null })
  }

  clearAllFilters() {
    this._router.navigate([]);
  }

  updateUrlQueryParams(queryParams: { [key: string]: string | number | boolean | null }) {
    this._router.navigate([], {
      queryParams,
      queryParamsHandling: "merge"
    });
  }

  formatParamKey(key: string): string {
    switch (key) {
      case "orderBy":
        return "Order by"
      case "hideOutOfStock":
        return "Hide out of stock";
      case "minPrice":
        return "Min price:";
      case "maxPrice":
        return "Max price:";
      default:
        return `${key[0].toUpperCase()}${key.slice(1)}:`;
    }
  }

  formatParamValue(value: string | number | boolean | undefined) {
    switch (value) {
      case "categoryName":
        return "category";
      case "supplierName":
        return "supplier";
      case "avgRating":
        return "avg. rating";
      case "ASC":
        return "ascending";
      case "DESC":
        return "descending";
      default:
        return value;
    }
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.currentLimit = e.pageSize;
    this.updateUrlQueryParams({ 
      page: this.currentPage, 
      limit: this.currentLimit 
    });
  }

  emitStyleEvent(e: MatButtonToggleChange) {
    this.toggleStyleEvent.emit(e);
  }

  setOrderBy(e: MatSelectChange) {
    const newParams: { orderBy: string, order?: string } = { orderBy: e.value };
    if (e.value === "bestsellers") {
     newParams.order = "DESC";
    }
    this.updateUrlQueryParams(newParams);
  }

  setOrder(e: MatRadioChange) {
    this.updateUrlQueryParams({ order: e.value });
  }

  setHideOutOfStock(e: MatSlideToggleChange) {
    this.updateUrlQueryParams({ hideOutOfStock: e.checked });
  }

  setPriceRange() {
    this.updateUrlQueryParams({ minPrice: this.minPrice, maxPrice: this.maxPrice });
  }

  ngOnDestroy() {
    this._paginationSubscription.unsubscribe();
    this._routeSubscription.unsubscribe();
  }
}
