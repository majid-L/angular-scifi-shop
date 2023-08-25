import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

type RequiredAddressField = "addressLine1" | "city" | "postcode";

@Component({
  selector: 'app-address-step',
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.sass']
})
export class AddressStepComponent {
  @Input() addressFormGroup: FormGroup<{
    addressLine1: FormControl<string | null>;
    addressLine2: FormControl<string | null>;
    city: FormControl<string | null>;
    county: FormControl<string | null>;
    postcode: FormControl<string | null>;
  }> | undefined;
  @Input() existingAddress: Address | null | undefined;
  @Input() type: "billingAddress" | "shippingAddress" | undefined;
  @Input() useExisting: { billingAddress: boolean, shippingAddress: boolean } | undefined;
  @Output() addressEvent = new EventEmitter<AddressEmitData>();

  getErrorMessage() {
    let msg = '';
    const requiredFields: RequiredAddressField[] = ["addressLine1", "city", "postcode"];
    requiredFields.forEach((field: RequiredAddressField) => {
      if (this.addressFormGroup?.controls[field].hasError('required')) {
        msg = 'You must enter a value.';
      }
    });
    return msg;
  }

  get hasError() {
    return this.addressFormGroup!.invalid;
  }

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

  handleSubmit(e: Event) {
    console.log(e);
  }

  useAddress(data: AddressEmitData) {
    this.clearValidators();
    this.addressEvent.emit(data);
  }
}