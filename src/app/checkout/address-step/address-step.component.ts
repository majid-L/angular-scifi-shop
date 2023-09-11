import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectActiveItem, selectDeleteStatus, selectUpdateStatus } from 'src/app/ngrx/account/account.feature';

type RequiredAddressField = "addressLine1" | "city" | "postcode";

@Component({
  selector: 'app-address-step',
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.sass']
})
export class AddressStepComponent {
  @Input() addressFormGroup: AddressFormGroup | undefined;
  @Input() existingAddress: Address | null | undefined;
  @Input() view: "checkout" | "account" | undefined;
  @Input() type: "billingAddress" | "shippingAddress" | undefined;
  @Input() useExisting: { billingAddress: boolean, shippingAddress: boolean } | undefined;
  @Output() addressEvent = new EventEmitter<AddressEmitData>();
  isCheckout: boolean | undefined;
  readonly updateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  readonly deleteStatus$: Observable<Status> = this._store.select(selectDeleteStatus);
  readonly activeItem$: Observable<AccountActiveItem> = 
    this._store.select(selectActiveItem);

  constructor(
    private _store: Store<AppState>
  ) { }

  ngOnInit() {
    this.isCheckout = this.view === "checkout";
  }

  get addressLine1() { return this.addressFormGroup!.get("addressLine1")!; }
  get city() { return this.addressFormGroup!.get("city")!; }
  get postcode() { return this.addressFormGroup!.get("postcode")!; }

  clearValidators() {
    for (const field in this.addressFormGroup!.controls) {
      const formControl = this.addressFormGroup!.controls[field as RequiredAddressField];
      formControl.clearValidators();
      formControl.updateValueAndValidity();
    }
  }

  addValidators() {
    this.clearValidators();
    for (const field in this.addressFormGroup!.controls) {
      if (!["addressLine1", "city", "postcode"].includes(field)) continue;
      const formControl = this.addressFormGroup!.controls[field as RequiredAddressField];
      formControl.setValidators([Validators.required]);
      formControl.updateValueAndValidity();
    }
  }

  handleSubmit() {
    this.useAddress({ 
      address: this.addressFormGroup!.value as Address, 
      type: this.type, 
      useExisting: false 
    })
  }

  useAddress(data: AddressEmitData) {
    this.clearValidators();
    this.addressEvent.emit(data);
  }
}