import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import { OrdersService } from "src/app/orders/orders.service";
import { httpError } from "../notification/notification.actions";
import { createOrder, createOrderSuccess, deleteOrder, deleteOrderSuccess, loadOrders, loadOrdersSuccess, loadSingleOrder, loadSingleOrderSuccess, updateOrder, updateOrderSuccess } from "./orders.actions";

@Injectable()
export class OrdersEffects {
  loadOrders$ = createEffect(() => this._actions$.pipe(
    ofType(loadOrders),
    exhaustMap(() => this._ordersService.getOrders()
      .pipe(
        map(ordersResponse => loadOrdersSuccess(ordersResponse)),
        catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      )
    )
  ));

  loadSingleOrder$ = createEffect(() => this._actions$.pipe(
    ofType(loadSingleOrder),
    exhaustMap(payload => {
      return this._ordersService.getSingleOrder(payload.orderId)
      .pipe(
        map(singleOrderResponse => loadSingleOrderSuccess(singleOrderResponse)),
        catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      )
    }
    )
  ));

  createOrder$ = createEffect(() => this._actions$.pipe(
    ofType(createOrder),
    exhaustMap(payload => this._ordersService.createOrder(payload)
      .pipe(
        map(newOrderResponse => {
          return createOrderSuccess(newOrderResponse);
        }),
        catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      )
    )
  ));

  updateOrder$ = createEffect(() => this._actions$.pipe(
    ofType(updateOrder),
    exhaustMap(payload => this._ordersService.updateOrder(payload)
      .pipe(
        map(singleOrderResponse => updateOrderSuccess(singleOrderResponse)),
        catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      )
    )
  ));

  deleteOrder$ = createEffect(() => this._actions$.pipe(
    ofType(deleteOrder),
    exhaustMap(({ orderId }) => this._ordersService.deleteOrder(orderId)
      .pipe(
        map(deletedOrderResponse => deleteOrderSuccess(deletedOrderResponse)),
        catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      )
    )
  ));

  constructor(
    private _actions$: Actions,
    private _ordersService: OrdersService
  ) { }
}