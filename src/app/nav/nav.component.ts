import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logoutRequest, showAuthOverlay } from '../ngrx/auth/auth.actions';
import { selectLoggedInUserId } from '../ngrx';
import { selectAccount } from '../ngrx/account/account.feature';
import { selectCartItemsCount } from '../ngrx/cart/cart.feature';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent {
  private _breakpointObserver = inject(BreakpointObserver);
  loggedInUserId$: Observable<number | string | null> = this.store.select(selectLoggedInUserId);
  status$: Observable<Status> = this.store.select(state => state.authSlice.status);
  currentUser$: Observable<Customer | null> = this.store.select(selectAccount);
  cartItemsCount$: Observable<number | undefined> = this.store.select(selectCartItemsCount);
  rippleRadius = 30;
  eventsSubject = new Subject<void>();

  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe('(max-width: 800px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  dataStream$: Observable<{
    status: Status, 
    isHandset: boolean, 
    currentUser: Customer | null,
    loggedInUserId: number | string | null,
    cartItemsCount: number | undefined
   }>;

  constructor(private store: Store<AppState>) {
    this.dataStream$ = combineLatest([
      this.status$, this.isHandset$, this.currentUser$, this.loggedInUserId$, this.cartItemsCount$
    ]).pipe(map(([status, isHandset, currentUser, loggedInUserId, cartItemsCount]) => {
      return {
        status, isHandset, currentUser, loggedInUserId, cartItemsCount
      }
    }));
  }
  
  showOverlay() {
    this.store.dispatch(showAuthOverlay());
  }

  handleLogout() {
    this.store.dispatch(logoutRequest());
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }
}
