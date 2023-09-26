import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { notify } from 'src/app/ngrx/notification/notification.actions';
import { clearSingleOrder, deleteOrder, loadSingleOrder } from 'src/app/ngrx/orders/orders.actions';
import { selectDeleteStatus, selectLoadStatus, selectNewOrder, selectSingleOrder } from 'src/app/ngrx/orders/orders.feature';
import { selectData } from '../../ngrx/notification/notification.feature';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.sass', '../orders/orders.component.sass']
})
export class SingleOrderComponent {
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
  readonly loggedInUserId$: Observable<number | string | null> = 
    this._store.select(selectLoggedInUserId);
  readonly errorData$: Observable<DialogContent | null> = 
    this._store.select(selectData);
  readonly dataStream$ = combineLatest([
    this._route.params, this.loggedInUserId$
  ]).pipe(map(([params, loggedInUserId]) => ({ params, loggedInUserId })));
  private _loggedInUserId: number | undefined;
  public orderId: string | undefined;
  public newOrderId: number | undefined;
  public render404 = false;
  private _subscription = Subscription.EMPTY;
  private _statusSubscription = Subscription.EMPTY;
  private _404Subscription = Subscription.EMPTY;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store,
    private _title: Title
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this._subscription = this.dataStream$
      .subscribe(({ params, loggedInUserId }) => {
        this.orderId = params["id"];
        this._title.setTitle("Order #" + params["id"])
        if (loggedInUserId) {
          this._loggedInUserId = Number(loggedInUserId);
          this._store.dispatch(loadSingleOrder({ 
            orderId: this.orderId!,
            customerId: Number(loggedInUserId)
          }));
        }
      });

    this._statusSubscription = this.deleteStatus$
      .subscribe(deleteStatus => {
        if (deleteStatus === "success") {
          this._store.dispatch(notify({
            title: `Order #${this.orderId} deleted.`,
            content: "Your order has been successfully deleted."
          }));
          this._router.navigate(['/']);
        }
      });

    this._404Subscription = this.errorData$.subscribe(data => {
      if ([404, 403].includes(data?.error?.status || 0)) {
        this.render404 = true;
      }
    });
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  formatTitle(order: Order) {
    return order.orderItems.map(item => item.product.name).join(", ");
  }

  deleteOrder() {
    this._store.dispatch(deleteOrder({ 
      orderId: Number(this.orderId),
      customerId: this._loggedInUserId!
    }));
  }

  ngOnDestroy() {
    this._store.dispatch(clearSingleOrder());
    this._subscription.unsubscribe();
    this._statusSubscription.unsubscribe();
    this._404Subscription.unsubscribe();
  }
}
