import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom } from 'rxjs/operators';
import { clearCart, loadCart, loadCartSuccess, removeCartItem, addToCart, updateCartSuccess, modifyQuantity } from "./cart.actions";
import { httpError } from "../notification/notification.actions";
import { CartService } from "src/app/cart/cart.service";
import { Store } from "@ngrx/store";
import { selectCartItems } from "./cart.feature";

@Injectable()
export class CartEffects {
  formatActionPayload ({ cart }: { cart: Cart | [] }) {
    const cartItems = (cart as Cart).cartItems || cart;
    return updateCartSuccess({ cartItems } as { cartItems: Cart | [] });
  }

  loadCart$ = createEffect(() => this.actions$.pipe(
    ofType(loadCart),
    exhaustMap(() => this.cartService.getCart()
    .pipe(
      map(cartResponse => loadCartSuccess(cartResponse.cart)),
      catchError(({ error }: { error: ApiError }) => of(httpError(error)))
    ))
  ));

  addToCart$ = createEffect(() => this.actions$.pipe(
    ofType(addToCart),
    withLatestFrom(this.store.select(selectCartItems)),
    exhaustMap(([newItem, cartItems]) => {
      return this.cartService.updateCart([ ...cartItems, newItem ])
      .pipe(
        map(cartResponse => this.formatActionPayload(cartResponse)),
        catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      );
    })
  ));

  removeCartItem$ = createEffect(() => this.actions$.pipe(
    ofType(removeCartItem),
    withLatestFrom(this.store.select(selectCartItems)),
    exhaustMap(([{ productId }, cartItems]) => {
      return this.cartService.updateCart(
        cartItems.filter(item => item.productId !== productId)
      ).pipe(
         map(cartResponse => this.formatActionPayload(cartResponse)),
         catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      );
    })
  ));

  modifyQuantity$ = createEffect(() => this.actions$.pipe(
    ofType(modifyQuantity),
    withLatestFrom(this.store.select(selectCartItems)),
    exhaustMap(([{ productId, quantity }, cartItems]) => {
      return this.cartService.updateCart(
        cartItems.map(item => {
          if (item.productId === productId) {
            return { ...item, quantity };
          } else {
            return item;
          }
        })
      ).pipe(
         map(cartResponse => this.formatActionPayload(cartResponse)),
         catchError(({ error }: { error: ApiError }) => of(httpError(error)))
      );
    })
  ));

  clearCart$ = createEffect(() => this.actions$.pipe(
    ofType(clearCart),
    exhaustMap(() => this.cartService.updateCart([])
    .pipe(
      map(cartResponse => this.formatActionPayload(cartResponse)),
      catchError(({ error }: { error: ApiError }) => of(httpError(error)))
    ))
  ));

  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private store: Store<AppState>
  ) { }
}