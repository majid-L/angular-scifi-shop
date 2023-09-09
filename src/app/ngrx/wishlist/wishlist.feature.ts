import { createFeature, createReducer, on } from "@ngrx/store"
import { httpError } from "../notification/notification.actions";
import { loadWishlist, loadWishlistSuccess, resetWishlistStatus, updateActiveId, updateWishlist, updateWishlistSuccess } from "./wishlist.actions";


const initialState: WishlistState = {
  loadStatus: "pending",
  updateStatus: "pending",
  activeId: -1,
  wishlist: null
}

export const wishlistReducer = createReducer(
  initialState,
  on(loadWishlist, state => ({
    ...state,
    loadStatus: "loading" as const
  })),
  on(loadWishlistSuccess, (state, payload) => ({
    ...state,
    loadStatus: "success" as const,
    wishlist: payload
  })),
  on(updateWishlist, state => ({
    ...state,
    updateStatus: "loading" as const
  })),
  on(updateWishlistSuccess, (state, payload) => ({
    ...state,
    updateStatus: "success" as const,
    wishlist: payload
  })),
  on(resetWishlistStatus, state => ({
    ...state,
    loadStatus: "pending" as const,
    updateStatus: "pending" as const
  })),
  on(updateActiveId, (state, { activeId }) => ({ ...state, activeId })),
  on(httpError, state => ({ 
    ...state, 
    loadStatus: "error" as const,
    updateStatus: "error" as const 
  }))
);

export const wishlistFeature = createFeature({
  name: "wishlist",
  reducer: wishlistReducer
});

export const {
  selectWishlist,
  selectLoadStatus,
  selectUpdateStatus,
  selectActiveId
} = wishlistFeature;