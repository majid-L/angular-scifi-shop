import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DialogComponent } from './dialog/dialog.component';
import { loadAccount } from './ngrx/account/account.actions';
import { Observable, Subscription } from 'rxjs';
import { selectDialogContent, selectDialogState } from './ngrx';
import { loadCart } from './ngrx/cart/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  showDialog$: Observable<boolean>;
  dialogContent$: Observable<DialogContent | null>;
  subscription: Subscription | null = null;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {
    this.showDialog$ = store.select(selectDialogState);
    this.dialogContent$ = store.select(selectDialogContent);
  }

  ngOnInit() {
    this.subscription = this.showDialog$.subscribe(value => {
      if (value) {
        this.dialog.open(DialogComponent, { 
          disableClose: value,
          data: this.dialogContent$
        });
      }
    });

    if (window.localStorage.getItem('userId')) {
      this.store.dispatch(loadAccount());
      this.store.dispatch(loadCart());
    }
  }

  ngOnDestroy() {
    this.subscription!.unsubscribe();
  }
}
