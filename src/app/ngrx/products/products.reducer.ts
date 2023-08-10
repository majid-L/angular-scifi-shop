import { createReducer, on } from '@ngrx/store';
import { httpError } from '../error/error.actions';
import { 
  loadProducts, 
  loadProductsSuccess
} from './products.actions';

export const initialState: ProductsState = {
  page: null,
  count: null,
  totalResults: null,
  products: null,
  status: "pending"
};

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, state => ({ ...state, status: "loading" as const })),
  on(loadProductsSuccess, (state, { page, count, totalResults, products }) => ({ 
    ...state,
    page,
    count,
    totalResults,
    products,
    status: "success" as const
  })),
  on(httpError, state => ({ ...state, status: "error" as const }))
);