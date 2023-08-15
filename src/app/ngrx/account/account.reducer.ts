import { createReducer, on } from '@ngrx/store';
import { loginSuccess } from '../auth/auth.actions';
import { httpError } from '../notification/notification.actions';
import { clearCurrentUser, loadAccount, loadAccountSuccess } from './account.actions';

export const initialState: AccountState = {
  account: null,
  status: "pending"
};

export const accountReducer = createReducer(
  initialState,
  on(loadAccount, state => ({ ...state, status: "loading" as const })),
  on(loadAccountSuccess, (state, account) => ({ account, status: "success" as const})),
  //on(loginSuccess, (state, { customer: account }) => ({ account, status: "success" as const})),
  on(clearCurrentUser, state => ({ ...state, account: null })),
  on(httpError, state => ({ ...state, status: "error" as const }))
);