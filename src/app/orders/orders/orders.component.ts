import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { deleteOrder, loadOrders } from 'src/app/ngrx/orders/orders.actions';
import { selectDeleteStatus, selectLoadStatus, selectNewOrder, selectOrders } from 'src/app/ngrx/orders/orders.feature';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent {
  readonly orders$: Observable<OrdersResponse | null> = 
    this._store.select(selectOrders);
  readonly loggedInUserId$: Observable<string | number | null> = 
    this._store.select(selectLoggedInUserId);
  readonly newOrder$: Observable<NewOrderResponse | null> =
    this._store.select(selectNewOrder);
  readonly loadStatus$: Observable<Status> = 
    this._store.select(selectLoadStatus);
  readonly deleteStatus$: Observable<Status> = 
    this._store.select(selectDeleteStatus);
  private _loggedInUserId: number | undefined;
  private _statusSubscription = Subscription.EMPTY;
  private _customerIdSubscription = Subscription.EMPTY;
  activeId: number = -1;
  public tableColumns: string[] = ["createdAt", "total", "paymentMethod", "status"];

  mediumViewport$: Observable<boolean> = this._breakpointObserver
  .observe('(min-width: 600px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private _store: Store,
    private _snackBar: MatSnackBar,
    private _breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this._customerIdSubscription = this.loggedInUserId$.subscribe(id => {
      if (id) {
        this._loggedInUserId = Number(id);
        this._store.dispatch(loadOrders({ customerId: Number(id) }));
      }
    });

    this._statusSubscription = this.deleteStatus$.subscribe(status => {
      if (status === "success") {
        this._snackBar.open(`Order #${this.activeId} deleted.`, 'Dismiss', {
          horizontalPosition: "start",
          verticalPosition: "top",
          duration: 7000
        });
      }
    })
  }

  ngOnDestroy() {
    this._statusSubscription.unsubscribe();
    this._customerIdSubscription.unsubscribe();
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  formatTitle(order: Order) {
    return order.orderItems.map(item => item.product.name).join(", ");
  }

  getOrderTotal(order: Order) {
    return order.orderItems.reduce((accumulator, current) => {
      return accumulator + (current.quantity * Number(current.product.price));
    }, 0);
  }

  deleteOrderById(orderId: number) {
    this.activeId = orderId;
    this._store.dispatch(deleteOrder({ 
      orderId,
      customerId: this._loggedInUserId!
    }));
  }
}