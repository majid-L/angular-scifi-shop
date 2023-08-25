import { createAction, props } from '@ngrx/store';

export const showAuthOverlay = createAction("[Login Component] Show Overlay");
export const hideAuthOverlay = createAction("[Login Component] Hide Overlay");
export const resetStatus = createAction("[Login Component] Reset Status");

export const loginRequest = createAction(
  "[Login Component] Login Request",
  props<AuthCredentials>()
);
export const loginSuccess = createAction(
  "[Login Component] Login Success",
  props<{ customer: Customer }>()
);

export const signup = createAction(
  "[Login Component] Signup",
  props<AuthCredentials>()
);
export const logoutRequest = createAction("[Login Component] Logout");
export const logoutSuccess = createAction(
  "[Login Component] Logout Success",
  props<{ msg: string }>()
);