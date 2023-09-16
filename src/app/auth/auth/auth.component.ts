import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { hideAuthOverlay, resetStatus } from 'src/app/ngrx/auth/auth.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { selectAuthIsLoading, selectAuthIsSuccess, selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent {
  authIsLoading$: Observable<boolean> = this._store.select(selectAuthIsLoading);
  authIsSuccess$: Observable<boolean> = this._store.select(selectAuthIsSuccess);
  loggedInUserId$: Observable<number | string | null> 
    = this._store.select(selectLoggedInUserId);
  formType = "Login";

  constructor(
    private _store: Store<AppState>,
    private _authService: SocialAuthService
  ) { }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  tabChange(e: MatTabChangeEvent) {
    switch (e.index) {
      case 0:
        this.formType = "Login";
        break;
      case 1:
        this.formType = "Signup";
        break;
    }
    this._store.dispatch(resetStatus());
  }

  googleLogin() {
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
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
