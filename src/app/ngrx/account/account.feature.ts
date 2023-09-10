import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { httpError } from '../notification/notification.actions';
import { clearCurrentUser, createOrUpdateAddress, createOrUpdateAddressSuccess, deleteAddress, deleteAddressSuccess, deleteUser, deleteUserSuccess, loadAccount, loadAccountSuccess, updateAccount, updateAccountSuccess } from './account.actions';

const initialState: AccountState = {
  account: null,
  loadStatus: "pending",
  updateStatus: "pending",
  deleteStatus: "pending"
};

const removeAddressFromAccount = (account: Customer, deletedAddressId: number) => {
  const accountCopy: Customer = { 
    ...account, 
    billingAddress: account.billingAddress ? { ...account.billingAddress } : null,
    shippingAddress: account.shippingAddress ? { ...account.shippingAddress } : null
  };

  if (accountCopy.billingAddress?.id === deletedAddressId) {
    delete accountCopy.billingAddress;
  }
  if (accountCopy.shippingAddress?.id === deletedAddressId) {
    delete accountCopy.shippingAddress;
  }

  return accountCopy;
}

export const accountReducer = createReducer(
  initialState,
  on(loadAccount, state => ({ 
    ...state,
    loadStatus: "loading" as const 
  })),
  on(loadAccountSuccess, (state, payload) => ({
    ...state,
    account: payload,
    loadStatus: "success" as const
  })),
  on(updateAccount, createOrUpdateAddress, state => ({
    ...state,
    updateStatus: "loading" as const
  })),
  on(updateAccountSuccess, (state, payload) => ({
    ...state,
    account: payload,
    updateStatus: "loading" as const
  })),
  on(createOrUpdateAddressSuccess, (state, payload) => {
    if (payload.hasOwnProperty("newAddress")) {
      return {
        ...state,
        account: (payload as CustomerNewAddress).customer,
        updateStatus: "success" as const
      }
    } else {
      return {
        ...state,
        account: payload as Customer,
        updateStatus: "success" as const
      }
    }
  }),
  on(deleteAddress, deleteUser, state => ({
    ...state,
    deleteStatus: "loading" as const
  })),
  on(deleteAddressSuccess, (state, payload) => {
    if (payload.hasOwnProperty("deletedAddress")) {
      const deletedAddressId = (payload as { deletedAddress: Address }).deletedAddress.id!;
      const updatedAccount = removeAddressFromAccount(state.account!, deletedAddressId);
      return {
        ...state,
        account: updatedAccount,
        deleteStatus: "success" as const
      }
    } else {
      return {
        ...state,
        account: payload as Customer,
        deleteStatus: "success" as const
      }
    }
  }),
  on(deleteUserSuccess, state => ({
    ...state,
    account: null,
    deleteStatus: "success" as const
  })),
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
  selectLoadStatus,
  selectUpdateStatus,
  selectDeleteStatus,
  selectBillingAddress,
  selectShippingAddress
} = accountFeature;