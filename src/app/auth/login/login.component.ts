import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { hideAuthOverlay, resetStatus } from 'src/app/ngrx/auth/auth.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { selectAuthIsLoading, selectAuthIsSuccess, selectLoggedInUserId, selectShowOverlay } from 'src/app/ngrx/auth/auth.feature';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  showOverlay$: Observable<boolean> = this._store.select(selectShowOverlay);
  authIsLoading$: Observable<boolean> = this._store.select(selectAuthIsLoading);
  authIsSuccess$: Observable<boolean> = this._store.select(selectAuthIsSuccess);
  loggedInUserId$: Observable<number | string | null> 
    = this._store.select(selectLoggedInUserId);
  formType = 'Login';

  constructor(private _store: Store<AppState>) { }

  tabChange(e: MatTabChangeEvent) {
    switch (e.index) {
      case 0:
        this.formType = 'Login';
        break;
      case 1:
        this.formType = 'Signup';
        break;
    }
    this._store.dispatch(resetStatus());
  }

  hideOverlay() {
    this._store.dispatch(hideAuthOverlay());
  }

  hideOverlayOnBodyClick(e: MouseEvent) {
    const elementId = (e.target as HTMLElement).id;
    if (elementId === "loginOverlay") {
      this.hideOverlay();
    }
  }
}
