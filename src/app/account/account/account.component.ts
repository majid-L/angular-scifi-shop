import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadAccount } from 'src/app/ngrx/account/account.actions';
import { selectAccount, selectStatus } from 'src/app/ngrx/account/account.feature';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {
  readonly accountData$: Observable<Customer | null> = 
    this._store.select(selectAccount);
  readonly accountStatus$: Observable<Status> = 
    this._store.select(selectStatus);
  private _subscription = Subscription.EMPTY;
  accountForm: FormGroup<{
    name: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    email: FormControl<string | null>;
    phone: FormControl<string | null>;
    avatar: FormControl<string | null>;
  }> | undefined;
  public hide = true;

  constructor(
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._store.dispatch(loadAccount());
    this._subscription = this.accountData$.subscribe(data => {
      if (data) {
        this.accountForm = this._formBuilder.group({
          name: [data.name],
          username: [data.username],
          password: [data.password],
          email: [data.email],
          phone: [data.phone],
          avatar: [data.avatar]
        });
      }
    });
  }

  updateAccountData() {
    console.log(this.accountForm!.value);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
