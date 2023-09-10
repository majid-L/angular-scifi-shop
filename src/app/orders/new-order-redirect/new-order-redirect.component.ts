import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { notify } from 'src/app/ngrx/notification/notification.actions';
import { updateOrder } from 'src/app/ngrx/orders/orders.actions';

@Component({
  selector: 'app-new-order-redirect',
  templateUrl: './new-order-redirect.component.html',
  styleUrls: ['./new-order-redirect.component.sass']
})
export class NewOrderRedirectComponent {
  private _subscription = Subscription.EMPTY;
  private readonly _loggedInUserId$: Observable<number | string | null> = 
    this._store.select(selectLoggedInUserId);
  private readonly _dataStream$ = 
    combineLatest([this._loggedInUserId$, this._route.queryParams])
    .pipe(map(([loggedInUserId, queryParams]) => {
      return { loggedInUserId, queryParams }
    }));
  public queryParams: Params | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _store: Store<AppState>,
    private _router: Router
  ) { }

  ngOnInit() {
    this._subscription = this._dataStream$.subscribe(({ loggedInUserId, queryParams }) => {
      if (!loggedInUserId) return;
      const customerId = Number(loggedInUserId);
      this.queryParams = queryParams;

      if (!queryParams["redirect_status"]) {
        return this._router.navigate(['/']);
      }
      if (queryParams) {
        if (queryParams["redirect_status"] === "failed") {
          this._store.dispatch(notify({
            title: "There was an error with the payment process.",
            content: `${queryParams["payment_method"]} payment has failed.` 
          }));
          this._store.dispatch(updateOrder({ 
            orderId: queryParams["order_id"], 
            status: "payment failed",
            customerId
          }));
        } else if (queryParams["redirect_status"] === "succeeded") {
          this._store.dispatch(notify({ 
            title: "Payment successful.", 
            content: `${queryParams["payment_method"]} payment has been successfully completed and your order is now completed and ready to view.`, 
            buttons: { newOrder: `/orders/${queryParams["order_id"]}` }
          }));
          this._store.dispatch(updateOrder({ 
            orderId: queryParams["order_id"], 
            status: "completed",
            customerId
          }));
        }
         this._router.navigate([], {
           queryParams: {
             "payment_intent": null,
             "payment_intent_client_secret": null
         },
           queryParamsHandling: "merge"
         });
      }
      return;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
