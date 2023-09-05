import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map } from "rxjs";
import { ProductService } from "src/app/products/product.service";
import { dispatchErrorAction } from "..";
import { loadCategories, loadCategoriesSuccess, loadSuppliers, loadSuppliersSuccess } from "./categories.actions";

@Injectable()
export class CategoriesEffects {
  loadCategories$ = createEffect(() => this._actions$.pipe(
    ofType(loadCategories),
    exhaustMap(() => this._productsService.getCategories()
    .pipe(
      map(categories => loadCategoriesSuccess(categories)),
      catchError(dispatchErrorAction)
    ))
  ));

  loadSuppliers$ = createEffect(() => this._actions$.pipe(
    ofType(loadSuppliers),
    exhaustMap(() => this._productsService.getSuppliers()
    .pipe(
      map(suppliers => loadSuppliersSuccess(suppliers)),
      catchError(dispatchErrorAction)
    ))
  ));

  constructor(
    private _actions$: Actions,
    private _productsService: ProductService
  ) {}
}