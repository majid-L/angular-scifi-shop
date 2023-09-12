import { Component, Input, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { createOrUpdateAddress, deleteAddress, resetStatus, updateActiveItem } from 'src/app/ngrx/account/account.actions';
import { selectActiveItem, selectDeleteStatus, selectUpdateStatus } from 'src/app/ngrx/account/account.feature';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.sass']
})
export class AddressesComponent {
  @Input() component: "singleOrder" | "account" | undefined;
  @Input() shippingAddress: Address | null | undefined;
  @Input() billingAddress: Address | null | undefined;
  readonly loggedInUserId$: Observable<string | number | null> =
    this._store.select(selectLoggedInUserId);
  readonly updateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  readonly deleteStatus$: Observable<Status> = this._store.select(selectDeleteStatus);
  readonly activeItem$: Observable<AccountActiveItem> = this._store.select(selectActiveItem);
  private _subscription = Subscription.EMPTY;
  private _loggedInUserId: number | undefined;
  formDisplayState = { billing: false, shipping: false };
  useExisting = { billingAddress: true, shippingAddress: true };
  shippingAddressFormGroup: AddressFormGroup | undefined;
  billingAddressFormGroup: AddressFormGroup | undefined;

  constructor(
    private _store: Store<AppState>,
    private _accountService: AccountService
  ) { }

  ngOnInit() {
    this._subscription = this.loggedInUserId$.subscribe((id) => {
      if (id) {
        this._loggedInUserId = Number(id);
      }
    });
  }

  ngOnChanges({ billingAddress, shippingAddress }: SimpleChanges) {
    if (billingAddress && shippingAddress) {
      this.billingAddressFormGroup = this._accountService.createAddressForm(billingAddress.currentValue);
      this.shippingAddressFormGroup = this._accountService.createAddressForm(shippingAddress.currentValue);
    }
  }

  get addresses(): { billing: Address, shipping: Address } {
    return {
      billing: this.billingAddress!,
      shipping: this.shippingAddress!
    };
  }

  formIsShown(type: string) {
   return this.formDisplayState[type as "billing" | "shipping"];
  }

  toggleForm(type: string) {
    this.formDisplayState[type as "billing" | "shipping"] =
      !this.formDisplayState[type as "billing" | "shipping"];
  }

  createOrUpdateAddress(data: AddressEmitData) {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveItem({ activeItem: data.type! }));
    this._store.dispatch(createOrUpdateAddress({
      requestBody: {
        [data.type!]: this._accountService.removeEmptyFields<Address>(data.address)
      } as { billingAddress: Address } | { shippingAddress: Address },
      customerId: this._loggedInUserId!
    }));
  }

  removeAddress(address: Address, type: string) {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveItem({ 
      activeItem: `${type}Address` as "billingAddress" | "shippingAddress"
    }));
    this._store.dispatch(deleteAddress({ 
      addressId: address.id!,
      addressIdType: `${type}AddressId` as AddressId,
      customerId: this._loggedInUserId!
    }));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}