import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { hideAuthOverlay, resetStatus } from 'src/app/ngrx/auth/auth.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  showOverlay$: Observable<boolean>;
  status$: Observable<Status>;
  loggedInUserId$: Observable<number | string | null>;
  formType = 'Login';

  constructor(private store: Store<AppState>) {
    this.showOverlay$ = store.select(state => state.authSlice.showOverlay);
    this.loggedInUserId$ = store.select(state => state.authSlice.loggedInUserId);
    this.status$ = store.select(state => state.authSlice.status);
  }

  tabChange(e: MatTabChangeEvent) {
    switch (e.index) {
      case 0:
        this.formType = 'Login';
        break;
      case 1:
        this.formType = 'Signup';
        break;
    }
    this.store.dispatch(resetStatus());
  }

  hideOverlay() {
    this.store.dispatch(hideAuthOverlay());
  }

  hideOverlayOnBodyClick(e: MouseEvent) {
    const elementId = (e.target as HTMLElement).id;
    if (elementId === "loginOverlay") {
      this.hideOverlay();
    }
  }
}
