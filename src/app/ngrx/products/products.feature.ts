import { createFeature, createReducer, on } from '@ngrx/store';
import { httpError } from '../notification/notification.actions';
import { 
  loadProducts, 
  loadProductsSuccess,
  loadSingleProduct,
  loadSingleProductSuccess,
  searchOrderHistory,
  searchOrderHistorySuccess
} from './products.actions';

export const initialState: ProductsState = {
  pagination: {
    page: 1,
    count: 0,
    totalResults: 0
  },
  products: null,
  singleProduct: null,
  searchTerm: null,
  orderSearchResult: null,
  loadStatus: "pending",
  searchStatus: "pending"
};

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, state => ({ ...state, loadStatus: "loading" as const })),
  on(loadProductsSuccess, (state, { page, count, totalResults, products }) => ({ 
    ...state,
    pagination: { page, count, totalResults },
    products,
    loadStatus: "success" as const
  })),
  on(loadSingleProduct, state => ({ ...state, loadStatus: "loading" as const })),
  on(loadSingleProductSuccess, (state, payload) => {
    return {
      ...state,
      loadStatus: "success" as const,
      singleProduct: payload
    }
  }),
  on(searchOrderHistory, state => ({ ...state, searchStatus: "loading" as const })),
  on(searchOrderHistorySuccess, (state, payload) => {
    return {
      ...state,
      searchStatus: "success" as const,
      orderSearchResult: payload
    }
  }),
  on(httpError, state => ({ 
    ...state, 
    loadStatus: "error" as const, 
    searchStatus: "error" as const 
  }))
);

export const productsFeature = createFeature({
  name: "products",
  reducer: productsReducer
});

export const {
  selectProducts,
  selectSingleProduct,
  selectOrderSearchResult,
  selectLoadStatus,
  selectSearchStatus,
  selectSearchTerm,
  selectPagination
} = productsFeature;