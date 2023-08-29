import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, combineLatest, Subject, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logoutRequest, showAuthOverlay } from '../ngrx/auth/auth.actions';
import { selectAccount } from '../ngrx/account/account.feature';
import { selectCartItemsCount } from '../ngrx/cart/cart.feature';
import { selectAnyLoadingState, selectLoggedInUserId, selectLogoutStatus } from '../ngrx/auth/auth.feature';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent {
  private _breakpointObserver = inject(BreakpointObserver);
  loggedInUserId$: Observable<number | string | null> = this._store.select(selectLoggedInUserId);
  authIsLoading$: Observable<boolean> = this._store.select(selectAnyLoadingState);
  logoutStatus$: Observable<Status> = this._store.select(selectLogoutStatus);
  currentUser$: Observable<Customer | null> = this._store.select(selectAccount);
  cartItemsCount$: Observable<number | undefined> = this._store.select(selectCartItemsCount);
  private _subscription = Subscription.EMPTY;
  rippleRadius = 30;
  eventsSubject = new Subject<void>();

  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe('(max-width: 800px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  dataStream$ = combineLatest([
    this.logoutStatus$, this.authIsLoading$, this.isHandset$, this.currentUser$, this.loggedInUserId$, this.cartItemsCount$
  ]).pipe(map(([logoutStatus, authIsLoading, isHandset, currentUser, loggedInUserId, cartItemsCount]) => {
    return {
      logoutStatus, authIsLoading, isHandset, currentUser, loggedInUserId, cartItemsCount
    }
  }));

  constructor(
    private _store: Store<AppState>,
    private _router: Router
  ) { }

  ngOnInit() {
    this._subscription = this.logoutStatus$.subscribe(status => {
      if (status === "success") {
        this._router.navigate(['/']);
      }
    })
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
  
  showOverlay() {
    this._store.dispatch(showAuthOverlay());
  }

  handleLogout() {
    this._store.dispatch(logoutRequest());
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }
}
