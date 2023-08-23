import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

type requiredAddressField = "addressLine1" | "city" | "postcode";

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
  @Input() orderAddress: Address | null | undefined;
  @Input() useExisting: { billingAddress: boolean, shippingAddress: boolean } | undefined;
  @Output() addressEvent = new EventEmitter<AddressEmitData>();

  getErrorMessage() {
    let msg = '';
    const requiredFields: requiredAddressField[] = ["addressLine1", "city", "postcode"];
    requiredFields.forEach((field: requiredAddressField) => {
      if (this.addressFormGroup?.controls[field].hasError('required')) {
        msg = 'You must enter a value.';
      }
    });
    return msg;
  }

  useAddress(data: AddressEmitData) {
    this.addressEvent.emit(data);
  }
}
