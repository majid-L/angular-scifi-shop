import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { httpError } from '../notification/notification.actions';
import { clearCurrentUser, loadAccount, loadAccountSuccess } from './account.actions';

const initialState: AccountState = {
  account: null,
  status: "pending"
};

export const accountReducer = createReducer(
  initialState,
  on(loadAccount, state => ({ ...state, status: "loading" as const })),
  on(loadAccountSuccess, (state, account) => ({ account, status: "success" as const})),
  on(clearCurrentUser, state => ({ ...state, account: null })),
  on(httpError, state => ({ ...state, status: "error" as const }))
);

export const accountFeature = createFeature({
  name: "account",
  reducer: accountReducer,
  extraSelectors: (({ selectAccount }) => ({
    selectBillingAddress: createSelector(
      selectAccount,
      (account: Customer | null) => account?.billingAddress
    ),
    selectShippingAddress: createSelector(
      selectAccount,
      (account: Customer | null) => account?.shippingAddress
    )
  }))
});

export const {
  selectAccount,
  selectStatus,
  selectBillingAddress,
  selectShippingAddress
} = accountFeature;