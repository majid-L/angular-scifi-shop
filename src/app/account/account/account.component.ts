import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadAccount } from 'src/app/ngrx/account/account.actions';
import { selectAccount, selectLoadStatus, selectUpdateStatus, selectDeleteStatus } from 'src/app/ngrx/account/account.feature';
import { selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {
  readonly loggedInUserId$: Observable<string | number | null> = 
    this._store.select(selectLoggedInUserId);
  readonly accountData$: Observable<Customer | null> = 
    this._store.select(selectAccount);
  readonly accountLoadStatus$: Observable<Status> = 
    this._store.select(selectLoadStatus);
  private _accountDataSubscription = Subscription.EMPTY;
  accountForm: FormGroup<{
    name: FormControl<string | null>;
    username: FormControl<string | null>;
    email: FormControl<string | null>;
    phone: FormControl<string | null>;
    avatar: FormControl<string | null>;
  }> | undefined;
  passwordField = ["", [Validators.required, Validators.minLength(6), Validators.pattern(/[A-Z]+/), Validators.pattern(/\d+/)]];
  passwordForm = this._formBuilder.group({
    password: this.passwordField,
    passwordConfirm: this.passwordField
  });
  passwordsDoNotMatch = false;
  public hide = true;

  constructor(
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._accountDataSubscription = this.loggedInUserId$.subscribe(id => {
      if (id) {
        this._store.dispatch(loadAccount({ customerId: Number(id) }));
      }
    });
    this._accountDataSubscription = this.accountData$.subscribe(data => {
      if (data) {
        this.accountForm = this._formBuilder.group({
          name: [data.name],
          username: [data.username],
          email: [data.email, Validators.email],
          phone: [data.phone],
          avatar: [data.avatar]
        });
      }
    });
  }

  get password() { return this.passwordForm.get("password"); }
  get passwordConfirm() { return this.passwordForm.get("passwordConfirm"); }

  showErrorMessage(field: "password" | "passwordConfirm") {
    if (field === "passwordConfirm") {
      if (this.passwordForm.touched && 
        this.password!.value !== this.passwordConfirm!.value) {
          return "Passwords do not match";
        }
    }
    if (this[field]!.errors?.["required"]) {
      return field === "password" ? "Password is required." : "Password confirmation is required.";
    }
    if (this[field]!.errors?.["minlength"]) {
      return "Password must be at least 6 characters long."
    }
    if (this[field]!.errors?.["pattern"]) {
      return "Password must containt at least 1 capital letter and 1 number.";
    }
    return;
  }

  updateAccountData() {
  }

  updatePassword() {

  }

  ngOnDestroy() {
    this._accountDataSubscription.unsubscribe();
  }
}
