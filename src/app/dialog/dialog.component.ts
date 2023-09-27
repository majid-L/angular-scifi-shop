import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { hideDialog } from '../ngrx/notification/notification.actions';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Observable<DialogContent>, 
    public dialogRef: MatDialogRef<DialogComponent>,
    private _store: Store<AppState>
  ) {}

  hideOverlay() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    this._store.dispatch(hideDialog());
  }
}