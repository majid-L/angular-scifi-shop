import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { selectUpdateStatus } from 'src/app/ngrx/cart/cart.feature';
import { loadSingleProduct, searchOrderHistory } from 'src/app/ngrx/products/products.actions';
import { selectSingleProduct, selectLoadStatus, selectOrderSearchResult, selectSearchStatus } from 'src/app/ngrx/products/products.feature';
import { loadProductReviews } from 'src/app/ngrx/reviews/reviews.actions';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.sass']
})
export class SingleProductComponent {
  productId: number | undefined;
  readonly singleProduct$: Observable<SingleProduct | null> = 
    this._store.select(selectSingleProduct);
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  readonly cartUpdateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  readonly orderSearchResult$: Observable<OrderSearchResponse | null> = 
    this._store.select(selectOrderSearchResult);
  readonly searchStatus$: Observable<Status> =
    this._store.select(selectSearchStatus);
  readonly loggedInUserId$: Observable<string | number | null> =
    this._store.select(selectLoggedInUserId);
  private _subscription = Subscription.EMPTY;

  readonly dataStream$ = combineLatest([
    this._route.params, this.cartUpdateStatus$, this.loggedInUserId$
  ]).pipe(map(([params, cartUpdateStatus, loggedInUserId]) => ({
    params, cartUpdateStatus, loggedInUserId
  })));

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._subscription = this.dataStream$
      .subscribe(({ params, cartUpdateStatus, loggedInUserId }) => {
        this.productId = params["id"];

        if (cartUpdateStatus === "success") {
          this._snackBar.open('Cart updated.', 'Dismiss', {
            horizontalPosition: "start",
            verticalPosition: "top",
            duration: 7000
          });
        }

        if (loggedInUserId) {
          this._store.dispatch(searchOrderHistory({ 
            customerId: Number(loggedInUserId),
            productId: this.productId! 
          }));
        }
    });
    this._store.dispatch(loadSingleProduct({ productId: this.productId! }));
    this._store.dispatch(loadProductReviews({ productId: this.productId! }));
  }

  ratingChanged(e: any) {
    console.log(e);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
