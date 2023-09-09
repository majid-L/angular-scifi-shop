import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom } from 'rxjs/operators';
import { clearCart, loadCart, loadCartSuccess, removeCartItem, addToCart, updateCartSuccess, modifyQuantity } from "./cart.actions";
import { httpError } from "../notification/notification.actions";
import { CartService } from "src/app/cart/cart.service";
import { Store } from "@ngrx/store";
import { selectCartItems } from "./cart.feature";
import { dispatchErrorAction } from "..";

@Injectable()
export class CartEffects {
  formatActionPayload ({ cart }: { cart: Cart | [] }) {
    const cartItems = (cart as Cart).cartItems || cart;
    return updateCartSuccess({ cartItems } as { cartItems: Cart | [] });
  }

  loadCart$ = createEffect(() => this.actions$.pipe(
    ofType(loadCart),
    exhaustMap(({ customerId }) => this.cartService.getCart(customerId)
    .pipe(
      map(cartResponse => loadCartSuccess(cartResponse.cart)),
      catchError(dispatchErrorAction)
    ))
  ));

  addToCart$ = createEffect(() => this.actions$.pipe(
    ofType(addToCart),
    withLatestFrom(this.store.select(selectCartItems)),
    exhaustMap(([cartItem, cartItems]) => {
      return this.cartService.updateCart([ ...cartItems, cartItem ], cartItem.customerId)
      .pipe(
        map(cartResponse => this.formatActionPayload(cartResponse)),
        catchError(dispatchErrorAction)
      );
    })
  ));

  removeCartItem$ = createEffect(() => this.actions$.pipe(
    ofType(removeCartItem),
    withLatestFrom(this.store.select(selectCartItems)),
    exhaustMap(([{ productId, customerId }, cartItems]) => {
      return this.cartService.updateCart(
        cartItems.filter(item => item.productId !== productId),
        customerId
      ).pipe(
         map(cartResponse => this.formatActionPayload(cartResponse)),
         catchError(dispatchErrorAction)
      );
    })
  ));

  modifyQuantity$ = createEffect(() => this.actions$.pipe(
    ofType(modifyQuantity),
    withLatestFrom(this.store.select(selectCartItems)),
    exhaustMap(([{ productId, customerId, quantity }, cartItems]) => {
      return this.cartService.updateCart(
        cartItems.map(item => {
          if (item.productId === productId) {
            return { ...item, quantity };
          } else {
            return item;
          }
        }), customerId
      ).pipe(
         map(cartResponse => this.formatActionPayload(cartResponse)),
         catchError(dispatchErrorAction)
      );
    })
  ));

  clearCart$ = createEffect(() => this.actions$.pipe(
    ofType(clearCart),
    exhaustMap(({ customerId }) => this.cartService.updateCart([], customerId)
    .pipe(
      map(cartResponse => this.formatActionPayload(cartResponse)),
      catchError(dispatchErrorAction)
    ))
  ));

  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private store: Store<AppState>
  ) { }
}