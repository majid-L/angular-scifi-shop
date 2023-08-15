import { createAction, props } from '@ngrx/store';

export const loadAccount = createAction("[Account Component] Load Account Data");

export const loadAccountSuccess = createAction(
  "[Account Response] Account Data Loaded - Success",
  props<Customer>()
);

export const clearCurrentUser = createAction("[Login Component] Clear Current User");