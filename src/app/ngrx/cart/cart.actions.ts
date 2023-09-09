import { createAction, props } from '@ngrx/store';

export const loadCart = createAction(
  "[Cart Component] Load Cart",
  props<{ customerId: number }>()
);

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
  props<{ 
    productId: number,
    customerId: number
  }>()
);

export const modifyQuantity = createAction(
  "[Cart Component] Modify Quantity - Loading",
  props<{ 
    productId: number, 
    customerId: number,
    quantity: number 
  }>()
);

export const clearCart = createAction(
  "[Cart Component] Clear Cart - Loading",
  props<{ customerId: number }>()
);

export const updateCartSuccess = createAction(
  "[Cart Component] Update Cart - Success",
  props<{ cartItems: Cart | [] }>()
);

export const updateActiveId = createAction(
  "[Cart Component] Update Active Id",
  props<{ activeId: number }>()
);