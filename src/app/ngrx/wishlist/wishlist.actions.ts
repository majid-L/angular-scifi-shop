import { createAction, props } from "@ngrx/store";

export const loadWishlist = createAction(
  "[Wishlist Component] Load Wishlist",
  props<{ customerId: number, format: string }>()
);

export const loadWishlistSuccess = createAction(
  "[Wishlist Component] Wishlist Loaded - Success",
  props<Wishlist>()
);

export const updateWishlist = createAction(
  "[Wishlist Component] Update Wishlist - Loading",
  props<{ 
    updatedWishlist: WishlistBasic | [],
    customerId: number
  }>()
);

export const updateWishlistSuccess = createAction(
  "[Wishlist Component] Update Wishlist - Success",
  props<Wishlist>()
);
  
export const updateActiveId = createAction(
  "[Wishlist Component] Update Active Id",
  props<{ activeId: number }>()
);

export const resetWishlistStatus = createAction(
  "[Wishlist Component] Reset Status"
);