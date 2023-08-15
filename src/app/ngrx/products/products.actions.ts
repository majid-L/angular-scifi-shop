import { createAction, props } from '@ngrx/store';

// This action is dispatched by the ngOnInit hook and triggers the loading process
export const loadProducts = createAction("[ProductList Component] Load Products");

// This action is triggered by the effect - if the loading succeeds
export const loadProductsSuccess = createAction(
  "[Products Response] Products Loaded - Success",
  props<ProductsResponse>()
);