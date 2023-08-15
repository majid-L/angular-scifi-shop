import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { ProductService } from "../../products/product.service";
import { 
  loadProducts, 
  loadProductsSuccess
} from "./products.actions";
import { httpError } from "../notification/notification.actions";

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadProducts),
    exhaustMap(() => this.productsService.getProducts()
    .pipe(
      map(productsResponse => loadProductsSuccess(productsResponse)),
      catchError(({ error }: { error: ApiError }) => of(httpError(error)))
    ))
  ));

  constructor(
    private actions$: Actions,
    private productsService: ProductService
  ) {}
}