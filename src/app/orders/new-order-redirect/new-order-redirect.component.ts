import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { notify } from 'src/app/ngrx/notification/notification.actions';
import { updateOrder } from 'src/app/ngrx/orders/orders.actions';

@Component({
  selector: 'app-new-order-redirect',
  templateUrl: './new-order-redirect.component.html',
  styleUrls: ['./new-order-redirect.component.sass']
})
export class NewOrderRedirectComponent {
  private _subscription = Subscription.EMPTY;
  readonly queryParams$: Observable<Params> = this._route.queryParams;

  constructor(
    private _route: ActivatedRoute,
    private _store: Store<AppState>,
    private _router: Router
  ) { }

  ngOnInit() {
    this._subscription = this._route.queryParams.subscribe(queryParams => {
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
            status: "payment failed" 
          }));
        } else if (queryParams["redirect_status"] === "succeeded") {
          this._store.dispatch(notify({ 
            title: "Payment successful.", 
            content: `${queryParams["payment_method"]} payment has been successfully completed and your order is now completed and ready to view.`, 
            buttons: { newOrder: `/orders/${queryParams["order_id"]}` }
          }));
          this._store.dispatch(updateOrder({ 
            orderId: queryParams["order_id"], 
            status: "completed" 
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
