import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { deleteUserSuccess } from '../account/account.actions';
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
  signupRequest,
  authenticateWithSSO,
  authenticateWithSSOSuccess,
  authFailure
} from './auth.actions';

const initialState: AuthState = {
  showOverlay: false,
  currentUser: null,
  loggedInUserId: window.localStorage.getItem('userId'),
  loginStatus: "pending",
  logoutStatus: "pending",
  signupStatus: "pending",
  logoutMsg: null,
  socialUser: null
};

export const authReducer = createReducer(
  initialState,
  on(showAuthOverlay, state => ({...state, showOverlay: true})),
  on(hideAuthOverlay, state => ({...state, showOverlay: false})),
  on(loginRequest, state => ({ ...state, loginStatus: "loading" as const })),
  on(authenticateWithSSO, (state, payload) => ({ 
    ...state,
    socialUser: payload.socialUser,
    loginStatus: "loading" as const 
  })),
  on(signupRequest, state => ({ ...state, signupStatus: "loading" as const })),
  on(loginSuccess, authenticateWithSSOSuccess, (state, payload) => {
    return { 
      ...state, 
      loggedInUserId: payload.customer.id,
      currentUser: payload.customer,
      loginStatus: "success" as const
     };
  }),
  on(signupSuccess, (state, payload) => {
    return { 
      ...state,
      loggedInUserId: payload.customer.id,
      currentUser: payload.customer,
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
  on(deleteUserSuccess, authFailure, state => ({
    ...state,
    loggedInUserId: null
  })),
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
  selectLogoutMsg,
  selectSocialUser
} = authFeature;