import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { deleteOrder, loadOrders } from 'src/app/ngrx/orders/orders.actions';
import { selectDeleteStatus, selectLoadStatus, selectOrders } from 'src/app/ngrx/orders/orders.feature';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent {
  readonly orders$: Observable<OrdersResponse | null> = this._store.select(selectOrders);
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  readonly deleteStatus$: Observable<Status> = this._store.select(selectDeleteStatus);
  private _subscription = Subscription.EMPTY;
  activeId: number = -1;

  constructor(
    private _store: Store,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._store.dispatch(loadOrders());
    this._subscription = this.deleteStatus$.subscribe(status => {
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
    this._subscription.unsubscribe();
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
    this._store.dispatch(deleteOrder({ orderId }))
  }
}