import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { resetStatus, updateAccount, updateActiveItem } from 'src/app/ngrx/account/account.actions';
import { selectAccount, selectLoadStatus, selectUpdateStatus, selectDeleteStatus, selectActiveItem } from 'src/app/ngrx/account/account.feature';
import { selectLoggedInUserId, selectSocialUser } from 'src/app/ngrx/auth/auth.feature';
import { AccountService } from '../account.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
  readonly socialUser$: Observable<SocialUser | null> = 
    this._store.select(selectSocialUser);
  readonly accountLoadStatus$: Observable<Status> = 
    this._store.select(selectLoadStatus);
  readonly updateStatus$: Observable<Status> = 
    this._store.select(selectUpdateStatus);
  readonly deleteStatus$: Observable<Status> = 
    this._store.select(selectDeleteStatus);
  readonly activeItem$: Observable<AccountActiveItem> = 
    this._store.select(selectActiveItem);

  readonly dataStream$ = combineLatest([
    this.loggedInUserId$, this.accountData$, this.activeItem$
  ]).pipe(map(([loggedInUserId, accountData, activeItem]) => ({
    loggedInUserId, accountData, activeItem
  })));

  readonly statusStream$ = combineLatest([this.updateStatus$, this.deleteStatus$])
  .pipe(map(([ updateStatus, deleteStatus]) => ({ updateStatus, deleteStatus })));
  
  private _subscription = Subscription.EMPTY;
  private _statusSubscription = Subscription.EMPTY;
  private _loggedInUserId: number | undefined;
  activeItem: AccountActiveItem = null;
  updateStatus: Status = "pending";
  deleteStatus: Status = "pending";

  accountForm = this._formBuilder.group({
    name: [""],
    username: [""],
    email: [""],
    phone: [""],
    avatar: [""]
  });
  validators = [Validators.required, Validators.minLength(6), Validators.pattern(/[A-Z]+/), Validators.pattern(/\d+/)];
  passwordFields = ["", [Validators.required, Validators.minLength(6), Validators.pattern(/[A-Z]+/), Validators.pattern(/\d+/)]];
  passwordForm = this._formBuilder.group({
    password: ["", this.validators],
    passwordConfirm: ["", this.validators]
  });
  public hide = true;

  constructor(
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  get name() { return this.accountForm.get("email"); }
  get username() { return this.accountForm.get("email"); }
  get avatar() { return this.accountForm.get("avatar"); }
  get phone() { return this.accountForm.get("phone"); }
  get password() { return this.passwordForm.get("password"); }
  get passwordConfirm() { return this.passwordForm.get("passwordConfirm"); }

  ngOnInit() {
     this.passwordForm.addValidators(this._accountService.matchValidator(
      this.passwordForm.get("password")!, this.passwordForm.get("passwordConfirm")!
    ));
    this.passwordForm.updateValueAndValidity();

    this._subscription = this.dataStream$.subscribe(({
      loggedInUserId, accountData, activeItem
    }) => {
      if (loggedInUserId) {
        this._loggedInUserId = Number(loggedInUserId);
      }

      if (accountData) {
        this.accountForm = this._formBuilder.group({
          name: [accountData.name, Validators.pattern(/[\S]+/)],
          username: [accountData.username, Validators.pattern(/[\S]+/)],
          email: [accountData.email, Validators.email],
          phone: [accountData.phone, [Validators.pattern(/^[^a-zA-Z]+$/), Validators.pattern(/[\S]+/)]],
          avatar: [accountData.avatar, Validators.pattern(/[\S]+/)]
        });
      }

      this.activeItem = activeItem;
    });

    this._statusSubscription = this.statusStream$
      .subscribe(({ updateStatus, deleteStatus }) => {
        this.updateStatus = updateStatus;
        this.deleteStatus = deleteStatus;

        if (updateStatus === "success" || deleteStatus === "success") {
          let message = 
            this.activeItem === "billingAddress" ? "Billing address " 
            : this.activeItem === "shippingAddress" ? "Shipping address"
            : this.activeItem === "password" ? "Password "
            : "Account ";
          if (updateStatus === "success") message += "updated successfully.";
          if (deleteStatus === "success") message += "deleted successfully.";
          this._snackBar.open(message, "Dismiss", {
            horizontalPosition: "start",
            verticalPosition: "top",
            duration: 8000
          });
          this.passwordForm.reset();
        }
      });
  }

  showErrorMessage(field: "password" | "passwordConfirm") {
    if (this[field]!.errors?.["matchError"]) {
      return "Passwords do not match.";
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
    const requestBody = this._accountService
    .removeEmptyFields<UpdateCustomerRequest>(
      this.accountForm.value as UpdateCustomerRequest,
      this._loggedInUserId!
    );
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveItem({ activeItem: "account" }));
    this._store.dispatch(updateAccount({
      requestBody,
      customerId: this._loggedInUserId!
    }));
  }

  updatePassword() {
    this._store.dispatch(resetStatus());
    this._store.dispatch(updateActiveItem({ activeItem: "password" }));
    this._store.dispatch(updateAccount({
      requestBody:this.passwordForm.value as UpdateCustomerRequest,
      customerId: this._loggedInUserId!
    }));
  }

  openDialog(customerId: number) {
    this.dialog.open(DeleteDialogComponent, {
      data: { customerId }
    });
  }

  ngOnDestroy() {
    this._store.dispatch(resetStatus());
    this._subscription.unsubscribe();
    this._statusSubscription.unsubscribe();
  }
}
