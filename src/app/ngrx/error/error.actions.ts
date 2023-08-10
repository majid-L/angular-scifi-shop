import { createAction, props } from '@ngrx/store';

export const showErrorOverlay = createAction("[Error Component] Show overlay");
export const hideErrorOverlay = createAction("[Error Component] Hide overlay");

// This action is triggered by effects - if the loading fails
export const httpError = createAction(
  "[Error Component] Set error message",
  props<ApiError | ProgressEvent>()
);