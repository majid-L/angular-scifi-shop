import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { selectBillingAddress, selectShippingAddress } from 'src/app/ngrx/account/account.feature';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.sass']
})
export class AddressesComponent {
  readonly billingAddress$: Observable<Address | null | undefined> = 
    this._store.select(selectBillingAddress);
  readonly shippingAddress$: Observable<Address | null | undefined> = 
    this._store.select(selectShippingAddress);
  readonly addresses$ = combineLatest([
    this.billingAddress$, this.shippingAddress$
  ]).pipe(map(([billingAddress, shippingAddress]) => ({
    "Billing": billingAddress, "Shipping": shippingAddress
  })));

  constructor(
    private _store: Store<AppState>
  ) { }
}