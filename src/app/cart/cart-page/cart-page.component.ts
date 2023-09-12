import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { selectLoadStatus } from 'src/app/ngrx/cart/cart.feature';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.sass']
})
export class CartPageComponent {
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  readonly accountData$: Observable<Customer | null> = this._store.select(selectAccount);

  constructor(
    private _store: Store<AppState>
  ) { }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }
}
