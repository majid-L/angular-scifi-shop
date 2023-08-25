import { createAction, props } from '@ngrx/store';

export const loadCart = createAction("[Cart Component] Load Cart");

export const loadCartSuccess = createAction(
  "[Cart Component] Cart Loaded - Success",
  props<Cart>()
);

export const addToCart = createAction(
  "[Cart Component] Update Cart - Loading",
  props<CartItem>()
);

export const removeCartItem = createAction(
  "[Cart Component] Remove Cart Item - Loading",
  props<{ productId: number }>()
);

export const modifyQuantity = createAction(
  "[Cart Component] Modify Quantity - Loading",
  props<{ productId: number, quantity: number }>()
);

export const clearCart = createAction("[Cart Component] Clear Cart - Loading");

export const updateCartSuccess = createAction(
  "[Cart Component] Update Cart - Success",
  props<{ cartItems: Cart | [] }>()
);

export const updateActiveId = createAction(
  "[Cart Component] Update Active Id",
  props<{ activeId: number }>()
);