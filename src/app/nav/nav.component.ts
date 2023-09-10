import { Component, inject, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, combineLatest, Subject, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logoutRequest, showAuthOverlay } from '../ngrx/auth/auth.actions';
import { selectAccount } from '../ngrx/account/account.feature';
import { selectCartItemsCount } from '../ngrx/cart/cart.feature';
import { selectAnyLoadingState, selectLoggedInUserId, selectLogoutStatus } from '../ngrx/auth/auth.feature';
import { NavigationEnd, Router } from '@angular/router';
import { selectCategories, selectCategoriesLoadStatus, selectSuppliers, selectSuppliersLoadStatus } from '../ngrx/categories/categories.feature';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent {
  @ViewChild("drawer") drawer: MatDrawer | undefined;
  private _breakpointObserver = inject(BreakpointObserver);
  categories$: Observable<Category[] | null> = this._store.select(selectCategories);
  suppliers$: Observable<Category[] | null> = this._store.select(selectSuppliers);
  categoriesLoadStatus$: Observable<Status> = 
    this._store.select(selectCategoriesLoadStatus);
  suppliersLoadStatus$: Observable<Status> = 
    this._store.select(selectSuppliersLoadStatus);
  loggedInUserId$: Observable<number | string | null> = this._store.select(selectLoggedInUserId);
  authIsLoading$: Observable<boolean> = this._store.select(selectAnyLoadingState);
  logoutStatus$: Observable<Status> = this._store.select(selectLogoutStatus);
  currentUser$: Observable<Customer | null> = this._store.select(selectAccount);
  cartItemsCount$: Observable<number | undefined> = this._store.select(selectCartItemsCount);
  private _subscription = Subscription.EMPTY;
  private _routerEvents = Subscription.EMPTY;
  rippleRadius = 30;
  eventsSubject = new Subject<void>();

  mediumViewport$: Observable<boolean> = this._breakpointObserver
    .observe('(max-width: 800px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  mobileViewport$: Observable<boolean> = this._breakpointObserver
  .observe('(max-width: 380px)')
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  dataStream$ = combineLatest([
    this.logoutStatus$, this.authIsLoading$, this.mediumViewport$, this.mobileViewport$, this.currentUser$, this.loggedInUserId$, this.cartItemsCount$
  ]).pipe(map(([logoutStatus, authIsLoading, mediumViewport, mobileViewport, currentUser, loggedInUserId, cartItemsCount]) => {
    return {
      logoutStatus, authIsLoading, mediumViewport, mobileViewport, currentUser, loggedInUserId, cartItemsCount
    }
  }));

  navigationStream$ = combineLatest([this.mediumViewport$, this._router.events])
  .pipe(map(([viewportIsMedium, routerEvent]) => ({ viewportIsMedium, routerEvent })));

  constructor(
    private _store: Store<AppState>,
    private _router: Router
  ) { }

  ngOnInit() {
    this._subscription = this.logoutStatus$.subscribe(status => {
      if (status === "success") {
        this._router.navigate(['/']);
      }
    });

    this._routerEvents = this.navigationStream$.subscribe(({ viewportIsMedium, routerEvent }) => {
      if (routerEvent instanceof NavigationEnd && viewportIsMedium) {
        this.drawer!.close();
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._routerEvents.unsubscribe();
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  toggleTheme(e: MatSlideToggleChange) {
    if (e.checked === true) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
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
