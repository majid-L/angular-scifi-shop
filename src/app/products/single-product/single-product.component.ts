import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, shareReplay, Subscription } from 'rxjs';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { selectActiveId, selectUpdateStatus } from 'src/app/ngrx/cart/cart.feature';
import { selectCreateStatus, selectUpdateStatus as selectReviewUpdateStatus, selectDeleteStatus, selectReviewStatus } from 'src/app/ngrx/reviews/reviews.feature';
import { loadSingleProduct, searchOrderHistory } from 'src/app/ngrx/products/products.actions';
import { selectSingleProduct, selectLoadStatus, selectOrderSearchResult, selectSearchStatus } from 'src/app/ngrx/products/products.feature';
import { deleteReview, loadProductReviews, resetReviewsStatus, updateActiveId } from 'src/app/ngrx/reviews/reviews.actions';
import { ReviewDialogComponent } from 'src/app/reviews/review-dialog/review-dialog.component';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.sass']
})
export class SingleProductComponent {
  private _productId: number | undefined;
  private _orderId: number | undefined;
  readonly singleProduct$: Observable<SingleProduct | null> = 
    this._store.select(selectSingleProduct);
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  readonly cartUpdateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  readonly reviewStatus$: Observable<Status> = this._store.select(selectReviewStatus);
  readonly reviewCreateStatus$: Observable<Status> = this._store.select(selectCreateStatus);
  readonly reviewUpdateStatus$: Observable<Status> = this._store.select(selectReviewUpdateStatus);
  readonly reviewDeleteStatus$: Observable<Status> = this._store.select(selectDeleteStatus);
  readonly activeId$: Observable<number> = this._store.select(selectActiveId);
  readonly orderSearchResult$: Observable<OrderSearchResponse | null> = 
    this._store.select(selectOrderSearchResult);
  readonly searchStatus$: Observable<Status> =
    this._store.select(selectSearchStatus);
  readonly loggedInUserId$: Observable<string | number | null> =
    this._store.select(selectLoggedInUserId);
  private _customerId: number | undefined;
  private _subscription = Subscription.EMPTY;
  private _searchResultSubscription = Subscription.EMPTY;
  private _isHandset = false;
  showCreateReviewButton = false;
  isHandset$: Observable<boolean> = this._breakpointObserver
  .observe('(max-width: 540px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  readonly dataStream$ = combineLatest([
    this._route.params, this.isHandset$, this.reviewCreateStatus$, this.reviewUpdateStatus$, this.reviewDeleteStatus$, this.loggedInUserId$
  ]).pipe(map(([params, isHandset, createStatus, updateStatus, deleteStatus, loggedInUserId]) => ({
    params, isHandset, createStatus, updateStatus, deleteStatus, loggedInUserId
  })));

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this._searchResultSubscription = this.orderSearchResult$
      .subscribe(orderSearchResult => {
        if (orderSearchResult) {
          if (orderSearchResult.lastOrdered && !orderSearchResult.review) {
            this.showCreateReviewButton = true;
            this._orderId = orderSearchResult.lastOrdered.orderId;
          } else {
            this.showCreateReviewButton = false;
          }
        }
      });

    this._subscription = this.dataStream$
      .subscribe(({ params, isHandset, createStatus, updateStatus, deleteStatus, loggedInUserId }) => {
        this._isHandset = isHandset;
        this._productId = params["id"];

        if (loggedInUserId && [createStatus, updateStatus, deleteStatus].some(status => status === "success")) {
          const snackBarMessage = createStatus === "success" ? "Your review has been published."
          : updateStatus === "success" ? "Review successfully updated."
          : deleteStatus === "success" ? "Your review has been deleted."
          : "Done";
          this._store.dispatch(searchOrderHistory({ 
            customerId: Number(loggedInUserId),
            productId: params["id"] 
          }));
          this._snackBar.open(snackBarMessage, 'Dismiss', {
            horizontalPosition: "start",
            verticalPosition: "top",
            duration: 7000
          });
        }

        if (loggedInUserId) {
          this._customerId = Number(loggedInUserId);
        }
    });
    
    if (this._customerId) {
      this._store.dispatch(searchOrderHistory({ 
        customerId: this._customerId,
        productId: this._productId! 
      }));
    }
    this._store.dispatch(loadSingleProduct({ productId: this._productId! }));
    //this._store.dispatch(loadProductReviews({ productId: this._productId! }));
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  newReviewTemplate(product: Product): NewReviewRequest & { product: Product } {
    return {
      customerId: Number(this._customerId!),
      productId: Number(this._productId!),
      orderId: this._orderId!,
      title: "",
      body: "",
      rating: 0 as Rating,
      product
    }
  }

  showDialog(
    review: NewReviewRequest | Review, 
    operation: "create" | "update") {
      this._store.dispatch(resetReviewsStatus());
      this.dialog.open(ReviewDialogComponent, {
        width: this._isHandset ? "100vw" : "80vw",
        maxWidth: "1000px",
        data: { review, operation }
      });
  }

  deleteReview(reviewId: number) {
    this._store.dispatch(updateActiveId({ activeId: reviewId }));
    this._store.dispatch(resetReviewsStatus());
    this._store.dispatch(deleteReview({ reviewId }));
  }

  ngOnDestroy() {
    this._store.dispatch(resetReviewsStatus());
    this._subscription.unsubscribe();
    this._searchResultSubscription.unsubscribe();
  }
}
