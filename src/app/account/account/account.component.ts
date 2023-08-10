import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadAccount } from 'src/app/ngrx/account/account.actions';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent {
  accountData$: Observable<Customer | null> = this.store.select(state => state.accountSlice.account);

  constructor(private store: Store<AppState>) {}
}
