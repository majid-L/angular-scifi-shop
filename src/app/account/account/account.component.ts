import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadAccount } from 'src/app/ngrx/account/account.actions';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {
  accountData$: Observable<Customer | null>;

  constructor(private store: Store<AppState>) {
    this.accountData$ = this.store.select(state => state.accountSlice.account);
  }

  ngOnInit() {
    this.store.dispatch(loadAccount());
  }
}
