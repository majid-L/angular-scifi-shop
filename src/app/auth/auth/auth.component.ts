import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { hideAuthOverlay, resetStatus } from 'src/app/ngrx/auth/auth.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { selectAuthIsLoading, selectAuthIsSuccess, selectLoggedInUserId } from 'src/app/ngrx/auth/auth.feature';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

const response = {
  email: "jiyyprjj@gmail.com",
  firstName: "Isbdippo",
  id: "100115001971272750195",
  idToken: "super_long_string",
  lastName: "Plisnhudssw",
  name: "Isbdippo Plisnhudssw",
  photoUrl: "https://lh3.googleusercontent.com/a/ACg8ocIzKjGFNDHcPX8oBQzPAf7WXGMHeOJr7aQNcqWPRbwA=s96-c",
  provider: "GOOGLE"
}

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

  ngOnInit() {
    this._authService.authState.subscribe((user: SocialUser) => {
      this.
      console.log(user);
    });
  }

  get theme() {
    return document.body.classList.contains("light-mode") ? "outline" : "filled_black";
  }

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
    //this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
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
