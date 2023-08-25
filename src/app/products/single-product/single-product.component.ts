import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectUpdateStatus } from 'src/app/ngrx/cart/cart.feature';
import { loadSingleProduct, searchOrderHistory } from 'src/app/ngrx/products/products.actions';
import { selectSingleProduct, selectLoadStatus, selectOrderSearchResult, selectSearchStatus } from 'src/app/ngrx/products/products.feature';

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
  private _loggedInUserId: string | null = window.localStorage.getItem('userId');
  private _routeSubscription = Subscription.EMPTY;
  private _cartStatusSubscription = Subscription.EMPTY;

  constructor(
    private _store: Store<AppState>,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._routeSubscription = this._route.params.subscribe(params => {
      this.productId = params["id"];
    });
    this._store.dispatch(loadSingleProduct({ productId: this.productId! }));
    this._store.dispatch(searchOrderHistory({ 
      customerId: Number(this._loggedInUserId), productId: this.productId! 
    }));

    this._cartStatusSubscription = this.cartUpdateStatus$.subscribe(updateStatus => {
      if (updateStatus === "success") {
        this._snackBar.open('Cart updated.', 'Dismiss', {
          horizontalPosition: "start",
          verticalPosition: "top",
          duration: 7000
        });
      }
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
    this._cartStatusSubscription.unsubscribe();
  }
}
