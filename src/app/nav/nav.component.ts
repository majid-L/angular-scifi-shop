import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logoutRequest, showAuthOverlay } from '../ngrx/auth/auth.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);
  loggedInUserId$: Observable<string | null>;
  logoutMsg$: Observable<string | null>;
  status$: Observable<Status>;
  currentUser$: Observable<Customer | null>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  dataStream$: Observable<{ logoutMsg: string | null, status: Status, isHandset: boolean }>;

  constructor(private store: Store<AppState>) {
    this.loggedInUserId$ = of(window.localStorage.getItem('userId'));
    this.logoutMsg$ = this.store.select(state => state.authSlice.logoutMsg);
    this.status$ = this.store.select(state => state.authSlice.status);
    this.currentUser$ = this.store.select(state => state.accountSlice.account);

    this.dataStream$ = combineLatest([
      this.logoutMsg$, this.status$, this.isHandset$
    ]).pipe(map(([logoutMsg, status, isHandset]) => {
      return {
        logoutMsg, status, isHandset
      }
    }));
  }

  yaya() {
    this.currentUser$.subscribe(x => console.log('CURRENT YOOZA >>>', x))
  }
  
  showOverlay() {
    this.store.dispatch(showAuthOverlay());
  }

  handleLogout() {
    this.store.dispatch(logoutRequest());
  }
}
