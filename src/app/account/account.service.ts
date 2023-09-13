import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _url = "https://taliphus.vercel.app/api/customers";
  private _emptyAddressFields: Address = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: ""
  }

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder
  ) { }

  getAccountData(customerId: number) {
    return this._http.get<Customer>(
      `${this._url}/${customerId}`,
      { withCredentials: true }
    );
  }

  updateAccount(requestBody: UpdateCustomerRequest, customerId: number) {
    return this._http.put<Customer>(
      `${this._url}/${customerId}`,
      requestBody,
      { withCredentials: true }
    );
  }

  createOrUpdateAddress(
    requestBody: { billingAddress: Address } | { shippingAddress: Address },
    customerId: number
  ) {
    return this._http.post<Customer | CustomerNewAddress>(
      `${this._url}/${customerId}/addresses`,
      requestBody,
      { withCredentials: true }
    );
  }

  deleteAddress(addressId: number, addressIdType: AddressId, customerId: number) {
    const options = {
      params: new HttpParams().append("identity", addressIdType),
      withCredentials: true
    }
    return this._http.delete<Customer | { deletedAddress: Address }>(
      `${this._url}/${customerId}/addresses/${addressId}`,
      options
    );
  }

  deleteAccount(customerId: number) {
    return this._http.delete<DeleteUserResponse>(
      `${this._url}/${customerId}`,
      { withCredentials: true }
    );
  }

  createAddressForm(address?: Address | null) {
    const fields = address ?? this._emptyAddressFields;
    return this._formBuilder.group({
      addressLine1: [fields.addressLine1, [Validators.required, Validators.pattern(/[\S]+/)]],
      addressLine2: [fields.addressLine2],
      city: [fields.city, [Validators.required, Validators.pattern(/[\S]+/)]],
      county: [fields.county],
      postcode: [fields.postcode, [Validators.required, Validators.pattern(/[\S]+/)]]
    });
  }

  removeEmptyFields<T>(object: T, customerId?: number): T {
    const sanitisedObject = { ...object };
    for (const key in sanitisedObject) {
      const value = sanitisedObject[key as keyof T];
      if (value === null) continue;
      if (!value?.toString().trim() || (key === "username" && customerId === 1)) {
        delete sanitisedObject[key as keyof T];
      }
    }
    return sanitisedObject;
  }

  matchValidator(password: AbstractControl, passwordConfirm: AbstractControl)
  : ValidatorFn {
    return () => {
      return password.value !== passwordConfirm.value
        ? { matchError: "Passwords do not match." }
        : null;
    };
  }
}