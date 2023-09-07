import { createAction, props } from "@ngrx/store";

export const loadCategories = createAction("[Nav Component] Load Categories");
export const loadSuppliers = createAction("[Nav Component] Load Suppliers");

export const loadCategoriesSuccess = createAction(
  "[Nav Component] Load Categories - Success",
  props<{categories: Category[]}>()
);

export const loadSuppliersSuccess = createAction(
  "[Nav Component] Load Suppliers - Success",
  props<{suppliers: Supplier[]}>()
);