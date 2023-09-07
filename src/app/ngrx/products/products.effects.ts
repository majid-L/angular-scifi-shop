import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { ProductService } from "../../products/product.service";
import { 
  loadProducts, 
  loadProductsSuccess,
  loadSingleProduct,
  loadSingleProductSuccess,
  searchOrderHistory,
  searchOrderHistorySuccess
} from "./products.actions";
import { dispatchErrorAction } from "..";

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() => this._actions$.pipe(
    ofType(loadProducts),
    exhaustMap(queryParams => this._productsService.getProducts(queryParams)
    .pipe(
      map(productsResponse => loadProductsSuccess(productsResponse)),
      catchError(dispatchErrorAction)
    ))
  ));

  loadSingleProduct$ = createEffect(() => this._actions$.pipe(
    ofType(loadSingleProduct),
    exhaustMap(payload => this._productsService.getSingleProduct(payload.productId)
      .pipe(
        map(singleProductResponse => {
          return loadSingleProductSuccess(singleProductResponse);
        }),
        catchError(dispatchErrorAction)
      )
    )
  ));

  searchOrderHistory$ = createEffect(() => this._actions$.pipe(
    ofType(searchOrderHistory),
    exhaustMap(payload => this._productsService.getProductFromOrderHistory(
      payload.customerId, payload.productId
    ).pipe(
      map(searchResponse => searchOrderHistorySuccess(searchResponse)),
      catchError(dispatchErrorAction)
    )
    )
  ));

  constructor(
    private _actions$: Actions,
    private _productsService: ProductService
  ) {}
}