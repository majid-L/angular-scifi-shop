import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { httpError } from '../notification/notification.actions';
import { 
  showAuthOverlay, 
  hideAuthOverlay,
  loginRequest, 
  logoutRequest,
  logoutSuccess, 
  loginSuccess,
  resetStatus,
  signupSuccess,
  signupRequest
} from './auth.actions';

const initialState: AuthState = {
  showOverlay: false,
  currentUser: null,
  loggedInUserId: window.localStorage.getItem('userId'),
  loginStatus: "pending",
  logoutStatus: "pending",
  signupStatus: "pending",
  logoutMsg: null
};

export const authReducer = createReducer(
  initialState,
  on(showAuthOverlay, state => ({...state, showOverlay: true})),
  on(hideAuthOverlay, state => ({...state, showOverlay: false})),
  on(loginRequest, state => ({ ...state, loginStatus: "loading" as const })),
  on(signupRequest, state => ({ ...state, signupStatus: "loading" as const })),
  on(loginSuccess, (state, payload) => {
    return { 
      ...state, 
      loggedInUserId: payload.customer.id,
      currentUser: payload.customer,
      loginStatus: "success" as const
     };
  }),
  on(signupSuccess, state => {
    return { 
      ...state,
      signupStatus: "success" as const
     };
  }),
  on(logoutRequest, state => ({ ...state, logoutStatus: "loading" as const })),
  on(logoutSuccess, (state, payload) => {
    return {
      ...state,
      loggedInUserId: null,
      logoutMsg: payload.msg,
      logoutStatus: "success" as const
    };
  }),
  on(resetStatus, state => ({ 
    ...state, 
    loginStatus: "pending" as const, 
    logoutStatus: "pending" as const,
    signupStatus: "pending" as const
  })),
  on(httpError, state => ({ 
    ...state, 
    loginStatus: "error" as const, 
    logoutStatus: "error" as const,
    signupStatus: "error" as const
  }))
);

export const authFeature = createFeature({
  name: "auth",
  reducer: authReducer,
  extraSelectors: (state) => ({
    selectAnyLoadingState: createSelector(
      state.selectLoginStatus,
      state.selectLogoutStatus,
      state.selectSignupStatus,
      (loginStatus, logoutStatus, signupStatus) => {
        return loginStatus === "loading"
          || logoutStatus === "loading"
          || signupStatus === "loading";
      }
    ),
    selectAuthIsLoading: createSelector(
      state.selectLoginStatus,
      state.selectSignupStatus,
      (loginStatus, signupStatus) => {
        return loginStatus === "loading" || signupStatus === "loading";
      }
    ),
    selectAuthIsSuccess: createSelector(
      state.selectLoginStatus,
      state.selectSignupStatus,
      (loginStatus, signupStatus) => {
        return loginStatus === "success" || signupStatus === "success";
      }
    ),
  })
});

export const {
  selectCurrentUser,
  selectLoggedInUserId,
  selectShowOverlay,
  selectLoginStatus,
  selectLogoutStatus,
  selectSignupStatus,
  selectAnyLoadingState,
  selectAuthIsLoading,
  selectAuthIsSuccess,
  selectLogoutMsg
} = authFeature;