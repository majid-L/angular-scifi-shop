import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DialogComponent } from './dialog/dialog.component';
import { loadAccount } from './ngrx/account/account.actions';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { loadCart } from './ngrx/cart/cart.actions';
import { selectData, selectShowDialog } from './ngrx/notification/notification.feature';
import { loadCategories, loadSuppliers } from './ngrx/categories/categories.actions';
import { loadWishlist } from './ngrx/wishlist/wishlist.actions';
import { selectLoggedInUserId, selectShowOverlay } from './ngrx/auth/auth.feature';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  private readonly _showDialog$: Observable<boolean> = 
    this._store.select(selectShowDialog);
  private readonly _dialogContent$: Observable<DialogContent | null> = 
    this._store.select(selectData);
  private readonly _loggedInUserId$: Observable<string | number | null> = 
    this._store.select(selectLoggedInUserId);
  private readonly _showLoginDialog$: Observable<boolean> = this._store.select(selectShowOverlay);
  private readonly _dataStream$ = combineLatest([
    this._showDialog$, this._loggedInUserId$, this._showLoginDialog$
  ]).pipe(map(([showDialog, loggedInUserId, showLoginDialog]) => ({
    showDialog, loggedInUserId, showLoginDialog
  })));
  private _snackBarRef: MatSnackBarRef<TextOnlySnackBar> | undefined;
  private _subscription: Subscription | null = null;

  constructor(
    private _store: Store<AppState>, 
    public dialog: MatDialog,
    private _snackBar: MatSnackBar 
  ) { }

  ngOnInit() {
    this._store.dispatch(loadCategories());
    this._store.dispatch(loadSuppliers());
    this._subscription = this._dataStream$.subscribe(({ showDialog, loggedInUserId, showLoginDialog }) => {
      if (showDialog) {
        this.dialog.open(DialogComponent, { 
          disableClose: showDialog,
          data: this._dialogContent$
        });
      }

      if (loggedInUserId) {
        this._store.dispatch(loadAccount());
        this._store.dispatch(loadCart({ customerId: Number(loggedInUserId) }));
        this._store.dispatch(loadWishlist({ 
          customerId: Number(loggedInUserId),
          format: "full"
        }));
      }

      if (showLoginDialog) {
        this._snackBarRef?.dismiss();
      }
    });

    if (!window.localStorage.getItem("userId")) {
      this._snackBarRef = this._snackBar.open('Log in or sign up to fully explore the app.', 'Dismiss', {
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: "login-prompt"
      });
    }
  }

  ngOnDestroy() {
    this._subscription!.unsubscribe();
  }
}
