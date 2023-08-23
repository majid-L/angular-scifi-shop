import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { hideDialog } from '../ngrx/notification/notification.actions';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Observable<DialogContent>, private store: Store<AppState>) {}

  hideOverlay() {
    this.store.dispatch(hideDialog());
  }
}