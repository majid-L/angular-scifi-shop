import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { httpError } from '../notification/notification.actions';
import { addToCart, clearCart, loadCart, loadCartSuccess, modifyQuantity, removeCartItem, resetStatus, updateActiveId, updateCartSuccess } from './cart.actions';

const initialState: CartState = {
    cart: null,
    activeId: -1,
    loadStatus: "pending",
    updateStatus: "pending"
}

export const cartReducer = createReducer(
  initialState,
  on(loadCart, state => ({ ...state, loadStatus: "loading" as const })),
  on(
    addToCart, 
    clearCart, 
    removeCartItem, 
    modifyQuantity, 
    state => ({ ...state, updateStatus: "loading" as const })),
  on(loadCartSuccess, (state, payload) => {
    return {
      ...state,
      cart: payload,
      loadStatus: "success" as const
    }
  }),
  on(updateCartSuccess, (state, { cartItems }) => {
    return {
      ...state,
      cart: { ...state.cart, cartItems } as Cart,
      updateStatus: "success" as const
    }
  }),
  on(updateActiveId, (state, { activeId }) => ({ ...state, activeId })),
  on(resetStatus, state => ({
    ...state,
    loadStatus: "pending" as const,
    updateStatus: "pending" as const
  })),
  on(httpError, state => ({ ...state, loadStatus: "error" as const, updateStatus: "error" as const }))
);

export const cartFeature = createFeature({
  name: "cart",
  reducer: cartReducer,
  extraSelectors: (({ selectCart }) => ({
    selectCartItems: createSelector(
      selectCart,
      (cart: Cart | null) => {
        if (!cart || !cart.cartItems) return [];
        const items = cart.cartItems;
      
        return items.length === 0 ? [] : items.map(item => {
          return {
            customerId: cart.id,
            productId: item.product.id,
            quantity: item.quantity
          }
        });
      }
    ),
    selectCartTotal: createSelector(
      selectCart,
      (cart: Cart | null) => {
        if (!cart || !cart.cartItems) return 0;
        const items = cart.cartItems;
        const total = items.length === 0 ? 0 : (items as CartItemDetail[])
          .reduce((accumulator: number, { quantity, product }: CartItemDetail) => {
            return accumulator + (quantity * Number(product.price));
          }, 0);
        return Number(total.toFixed(2));
      }
    ),
    selectCartItemsCount: createSelector(
      selectCart,
      (cart: Cart | null) => cart?.cartItems.length
    )
  }))
});

export const {
  selectCart,
  selectActiveId,
  selectLoadStatus,
  selectUpdateStatus,
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount
} = cartFeature;