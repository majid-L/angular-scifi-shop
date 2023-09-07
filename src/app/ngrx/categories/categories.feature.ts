import { createFeature, createReducer, createSelector, on } from "@ngrx/store"
import { httpError } from "../notification/notification.actions";
import { loadCategories, loadCategoriesSuccess, loadSuppliers, loadSuppliersSuccess } from "./categories.actions";

const initialState: CategoriesState = {
  categories: null,
  suppliers: null,
  categoriesLoadStatus: "pending",
  suppliersLoadStatus: "pending"
}

export const categoriesReducer = createReducer(
  initialState,
  on(loadCategories, state => ({ 
    ...state, 
    categoriesLoadStatus: "loading" as const 
  })),
  on(loadSuppliers, state => ({ 
    ...state, 
    suppliersLoadStatus: "loading" as const
  })),
  on(loadCategoriesSuccess, (state, { categories }) => {
    return {
      ...state,
      categories,
      categoriesLoadStatus: "success" as const
    }
  }),
  on(loadSuppliersSuccess, (state, { suppliers }) => {
    return {
      ...state,
      suppliers,
      suppliersLoadStatus: "success" as const
    }
  }),
  on(httpError, state => ({ 
    ...state,
    categoriesLoadStatus: "error" as const,
    suppliersLoadStatus: "error" as const
  }))
);

export const categoriesFeature = createFeature({
  name: "categories",
  reducer: categoriesReducer
});

export const {
  selectCategories,
  selectSuppliers,
  selectCategoriesLoadStatus,
  selectSuppliersLoadStatus
} = categoriesFeature;