import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { hideDialog } from '../ngrx/notification/notification.actions';
import { selectData } from '../ngrx/notification/notification.feature';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class DialogComponent {
  readonly errorStatus$: Observable<DialogContent | null> = 
    this._store.select(selectData);
  private _subscription = Subscription.EMPTY;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Observable<DialogContent>, 
    public dialogRef: MatDialogRef<DialogComponent>,
    private _store: Store<AppState>,
    private _router: Router
  ) {}

  ngOnInit() {
    this._subscription = this.errorStatus$.subscribe(data => {
      if (data?.error?.status === 404) {
        //this._router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  hideOverlay() {
    this.dialogRef.close();
    this._store.dispatch(hideDialog());
  }
}