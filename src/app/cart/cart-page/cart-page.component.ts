import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { selectCartItemsCount, selectLoadStatus } from 'src/app/ngrx/cart/cart.feature';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.sass']
})
export class CartPageComponent {
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  readonly cartItemsCount$: Observable<number | undefined> = this._store.select(selectCartItemsCount);
  readonly accountData$: Observable<Customer | null> = this._store.select(selectAccount);

  constructor(
    private _store: Store<AppState>
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }
}
