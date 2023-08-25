import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { notify } from 'src/app/ngrx/notification/notification.actions';
import { clearSingleOrder, deleteOrder, loadSingleOrder } from 'src/app/ngrx/orders/orders.actions';
import { selectDeleteStatus, selectLoadStatus, selectNewOrder, selectSingleOrder } from 'src/app/ngrx/orders/orders.feature';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.sass', '../orders/orders.component.sass']
})
export class SingleOrderComponent {
  orderId: string | undefined;
  private _subscription = Subscription.EMPTY;
  readonly singleOrder$: Observable<SingleOrderResponse | null> = 
    this._store.select(selectSingleOrder);
  readonly loadStatus$: Observable<string> = 
    this._store.select(selectLoadStatus);
  readonly deleteStatus$: Observable<Status> = 
    this._store.select(selectDeleteStatus);
  readonly newOrder$: Observable<NewOrderResponse | null> =
    this._store.select(selectNewOrder);
  readonly accountData$: Observable<Customer | null> =
    this._store.select(selectAccount);
  readonly dataStream$ = combineLatest([
    this._route.params, this.singleOrder$, this.newOrder$, this.deleteStatus$
  ]).pipe(
    map(([params, singleOrder, newOrder, deleteStatus]) => ({ 
      params, singleOrder, newOrder, deleteStatus
    }))
  );

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store
  ) { }

  ngOnInit() {
    this._subscription = this.dataStream$
      .subscribe(({ params, newOrder, deleteStatus }) => {
        this.orderId = params["id"];
        if (deleteStatus === "success") {
          this._store.dispatch(notify({
            title: `Order #${this.orderId} deleted.`,
            content: "Your order has been successfully deleted."
          }));
          this._router.navigate(['/']);
        }
      });
    this._store.dispatch(loadSingleOrder({ orderId: this.orderId! }));
  }

  formatTitle(order: Order) {
    return order.orderItems.map(item => item.product.name).join(", ");
  }

  deleteOrder() {
    this._store.dispatch(deleteOrder({ orderId: Number(this.orderId) }));
  }

  ngOnDestroy() {
    this._store.dispatch(clearSingleOrder());
    this._subscription.unsubscribe();
  }
}
