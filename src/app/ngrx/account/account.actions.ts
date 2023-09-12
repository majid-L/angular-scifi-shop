import { createAction, props } from '@ngrx/store';

export const loadAccount = createAction(
  "[Account Component] Load Account Data",
  props<{ customerId: number }>()
);
export const loadAccountSuccess = createAction(
  "[Account Component] Account Data Loaded - Success",
  props<Customer>()
);

export const updateAccount = createAction(
  "[Account Component] Update Account - Loading",
  props<{
    requestBody: UpdateCustomerRequest,
    customerId: number
  }>()
);
export const updateAccountSuccess = createAction(
  "[Account Component] Update Account - Success",
  props<Customer>()
);

export const createOrUpdateAddress = createAction(
  "[Account Component] Create Or Update Address - Loading",
  props<{
    requestBody: { billingAddress: Address } | { shippingAddress: Address },
    customerId: number
  }>()
);
export const createOrUpdateAddressSuccess = createAction(
  "[Account Component] Create Or Update Address - Success",
  props<Customer | CustomerNewAddress>()
);

export const deleteAddress = createAction(
  "[Account Component] Delete Address - Loading",
  props<{ 
    addressId: number,
    addressIdType: AddressId,
    customerId: number 
  }>()
);
export const deleteAddressSuccess = createAction(
  "[Account Component] Delete Address - Success",
  props<Customer | { deletedAddress: Address }>()
);

export const deleteUser = createAction(
  "[Account Component] Delete User - Loading",
  props<{ customerId: number }>()
);
export const deleteUserSuccess = createAction(
  "[Account Component] Delete User - Success",
  props<DeleteUserResponse>()
);

export const updateActiveItem = createAction(
  "[Account Component] - Update Active Item",
  props<{ activeItem: AccountActiveItem }>()
);

export const resetStatus = createAction("[Account Component] Reset Status");
export const clearCurrentUser = createAction("[Login Component] Clear Current User");