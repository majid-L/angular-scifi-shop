import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadAllReviews, loadCustomerReviews, loadProductReviews } from 'src/app/ngrx/reviews/reviews.actions';
import { selectLoadStatus, selectPagination } from 'src/app/ngrx/reviews/reviews.feature';

@Component({
  selector: 'app-reviews-pagination',
  templateUrl: './reviews-pagination.component.html',
  styleUrls: ['./reviews-pagination.component.sass', '../../products/products-pagination/products-pagination.component.sass']
})
export class ReviewsPaginationComponent {
  @Input() component: "reviews" | "product" | undefined;
  @Input() productId: number | undefined;
  readonly pagination$: Observable<Pagination> = 
    this._store.select(selectPagination);
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  currentPage = 1;
  currentLimit = 25;
  //private _idParam: number | undefined;
  private _subscription = Subscription.EMPTY;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  validateNumericalParam(param: "page" | "limit", value: string | null): number {
    if (!value || isNaN(Number(value)) || Number(value) === 0) {
      return param === "page" ? 1 : 25;
    } else {
      return Number(value);
    }
  }

  ngOnInit() {
    if (this.productId) {
      this._store.dispatch(loadProductReviews({ 
        productId: this.productId,
        queryParams: {  page: 1, limit: 25}
      }));
    }

    this._subscription = this._route.queryParamMap.subscribe(queryParamMap => {
      const customerId = queryParamMap.get("customerId");
      const page = this.validateNumericalParam("page", queryParamMap.get("page"));
      const limit = this.validateNumericalParam("limit", queryParamMap.get("limit"));

      if (customerId) {
        if (!isNaN(Number(customerId))) { // query param ID is valid
          this._store.dispatch(loadCustomerReviews({ 
            customerId: Number(customerId),
            queryParams: { page, limit }
          }));
        } else {
          this._store.dispatch(loadAllReviews({ page, limit }));
        }
      } else if (!customerId) {
        this._store.dispatch(loadAllReviews({ page, limit }));
      } else if (this.productId && (page > 1 || limit !== 25)) {
        this._store.dispatch(loadProductReviews({ 
          productId: this.productId,
          queryParams: {  page, limit }
        }));
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.currentLimit = e.pageSize;
    this._router.navigate([], {
      queryParams: { page: e.pageIndex + 1, limit: e.pageSize },
      queryParamsHandling: "merge"
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
