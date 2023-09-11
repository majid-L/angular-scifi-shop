import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadAccount, resetStatus, updateAccount, updateActiveItem } from 'src/app/ngrx/account/account.actions';
import { selectAccount, selectLoadStatus, selectUpdateStatus, selectDeleteStatus, selectActiveItem } from 'src/app/ngrx/account/account.feature';
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
  // account update status
  // account active item
  private _accountDataSubscription = Subscription.EMPTY;
  private _loggedInUserIdSubscription = Subscription.EMPTY;
  private _loggedInUserId: number | undefined;
  accountForm = this._formBuilder.group({
    name: [""],
    username: [""],
    email: [""],
    phone: [""],
    avatar: [""]
  });
  passwordField = ["", [Validators.required, Validators.minLength(6), Validators.pattern(/[A-Z]+/), Validators.pattern(/\d+/)]];
  passwordForm = this._formBuilder.group({
    password: this.passwordField,
    passwordConfirm: this.passwordField
  });
  public hide = true;

  constructor(
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._loggedInUserIdSubscription = this.loggedInUserId$.subscribe(id => {
      if (id) {
        this._loggedInUserId = Number(id);
        this._store.dispatch(loadAccount({ customerId: Number(id) }));
      }
    });
    this._accountDataSubscription = this.accountData$.subscribe(data => {
      if (data) {
        this.accountForm = this._formBuilder.group({
          name: [data.name, Validators.pattern(/[\S]+/)],
          username: [data.username, Validators.pattern(/[\S]+/)],
          email: [data.email, Validators.email],
          phone: [data.phone, [Validators.pattern(/^[^a-zA-Z]+$/), Validators.pattern(/[\S]+/)]],
          avatar: [data.avatar, Validators.pattern(/[\S]+/)]
        });
      }
    });
  }

  get name() { return this.accountForm.get("email"); }
  get username() { return this.accountForm.get("email"); }
  get avatar() { return this.accountForm.get("avatar"); }
  get phone() { return this.accountForm.get("phone"); }
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
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveItem({ activeItem: "account" }));
    this._store.dispatch(updateAccount({
      requestBody: this.accountForm.value as UpdateCustomerRequest,
      customerId: this._loggedInUserId!
    }));
  }

  updatePassword() {

  }

  ngOnDestroy() {
    this._accountDataSubscription.unsubscribe();
    this._loggedInUserIdSubscription.unsubscribe();
  }
}
