import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map } from "rxjs";
import { WishlistService } from "src/app/wishlist/wishlist.service";
import { dispatchErrorAction } from "..";
import { loadWishlist, loadWishlistSuccess, updateWishlist, updateWishlistSuccess } from "./wishlist.actions";

@Injectable()
export class WishlistEffects {
  loadWishlist$ = createEffect(() => this._actions$.pipe(
    ofType(loadWishlist),
    exhaustMap(({ customerId, format }) => {
      return this._wishlistService.getWishlistItems(customerId, format)
      .pipe(
        map(({ wishlist }) => {
          return loadWishlistSuccess(wishlist);
        }),
        catchError(dispatchErrorAction)
      )
    })
  ));

  updateWishList$ = createEffect(() => this._actions$.pipe(
    ofType(updateWishlist),
    exhaustMap(({ updatedWishlist, customerId }) => {
      return this._wishlistService.updateWishlist(updatedWishlist, customerId)
        .pipe(
          map(({ wishlist }) => updateWishlistSuccess(wishlist)),
          catchError(dispatchErrorAction)
        )
    })
  ));

  constructor(
    private _actions$: Actions,
    private _wishlistService: WishlistService
  ) { }
}