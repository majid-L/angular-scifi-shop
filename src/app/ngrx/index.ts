import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { accountReducer } from './account/account.reducer';
import { authReducer } from './auth/auth.reducer';
import { errorReducer } from './error/error.reducer';
import { productsReducer } from './products/products.reducer';

export const reducers: ActionReducerMap<AppState> = {
  authSlice: authReducer,
  accountSlice: accountReducer,
  productsSlice: productsReducer,
  errorSlice: errorReducer
};

// log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    //console.log('state', state);
    //console.log('action', action);
 
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [debug] : [];

// Selectors
const selectProductsSlice = (state: AppState) => state.productsSlice;
export const selectProducts = createSelector(
  selectProductsSlice,
  (state: ProductsState) => state.products
);
export const selectStatus = createSelector(
  selectProductsSlice,
  (state: ProductsState) => state.status
);

const selectErrorSlice = (state: AppState) => state.errorSlice;
export const selectError = createSelector(
  selectErrorSlice,
  (state: ErrorState) => state
);

const selectAuthSlice = (state: AppState) => state.authSlice;
export const selectOverlayState = createSelector(
  selectAuthSlice,
  (state: AuthState) => state.showOverlay
);