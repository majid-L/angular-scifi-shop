import { createReducer, on } from '@ngrx/store';
import { httpError } from '../notification/notification.actions';
import { 
  showAuthOverlay, 
  hideAuthOverlay, 
  signup, 
  loginRequest, 
  logoutRequest,
  logoutSuccess, 
  loginSuccess,
  resetStatus
} from './auth.actions';

export const initialState: AuthState = {
  showOverlay: false,
  currentUser: null,
  loggedInUserId: window.localStorage.getItem('userId'),
  status: "pending",
  logoutMsg: null
};

export const authReducer = createReducer(
  initialState,
  on(showAuthOverlay, state => ({...state, showOverlay: true})),
  on(hideAuthOverlay, state => ({...state, showOverlay: false})),
  on(loginRequest, state => ({ ...state, status: "loading" as const })),
  on(loginSuccess, (state, payload) => {
    return { 
      ...state, 
      loggedInUserId: payload.customer.id,
      currentUser: payload.customer,
      status: "success" as const
     };
  }),
  on(logoutRequest, state => ({ ...state, status: "loading" as const })),
  on(logoutSuccess, (state, payload) => {
    return {
      ...state,
      loggedInUserId: null,
      logoutMsg: payload.msg,
      status: "success" as const
    };
  }),
  on(resetStatus, state => ({ ...state, status: "pending" as const })),
  on(httpError, state => ({ ...state, status: "error" as const }))
);