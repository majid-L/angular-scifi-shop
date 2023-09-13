import { createAction, props } from '@ngrx/store';

export const loadProducts = createAction(
  "[ProductList Component] Load Products",
  props<ProductsUrlParams>()
);

export const loadProductsSuccess = createAction(
  "[ProductList Component] Load Products - Success",
  props<ProductsResponse>()
);

export const loadSingleProduct = createAction(
  "[SingleProduct Component] Load Single Product",
  props<{ productId: number }>()
);

export const loadSingleProductSuccess = createAction(
  "[SingleProduct Component] Load Single Product - Success",
  props<SingleProduct>()
);

export const searchOrderHistory = createAction(
  "[SingleProduct Component] Search Order History - Loading",
  props<{ customerId: number, productId: number }>()
);

export const searchOrderHistorySuccess = createAction(
  "[SingleProduct Component] Search Order History - Success",
  props<OrderSearchResponse>()
);

export const setSearchTerm = createAction(
  "[Search Component] Update Search Term",
  props<{ searchTerm: string | null }>()
);