import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { selectData } from 'src/app/ngrx/notification/notification.feature';
import { selectCustomer, selectPagination, selectReviews } from 'src/app/ngrx/reviews/reviews.feature';

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.sass']
})
export class ReviewsPageComponent {
  readonly accountData$: Observable<Customer | null> = 
    this._store.select(selectAccount);
  readonly reviews$: Observable<Review[] | [] | null> = 
    this._store.select(selectReviews);
  readonly customer$: Observable<Customer | null> = 
    this._store.select(selectCustomer);
  readonly pagination$: Observable<Pagination> = 
    this._store.select(selectPagination);
  readonly errorStatus$: Observable<DialogContent | null> = this._store.select(selectData);
  private _errorSubscription = Subscription.EMPTY;
  public show404 = false;

  readonly dataStream$ = combineLatest([
    this.reviews$, this.pagination$, this.customer$
  ]).pipe(map(([reviews, pagination, customer]) => ({
    reviews, pagination, customer
  })));

  constructor(
    private _store: Store<AppState>,
    private _router: Router
  ) { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this._errorSubscription = this.errorStatus$.subscribe(data => {
      if (data?.error?.status === 404) {
        this.show404 = true;
      }
    });
  }

  loadAllReviews() {
    this._router.navigate([]);
  }

  loadMyReviews(customerId: number) {
    this._router.navigate([], {
      queryParams: { customerId }
    });
  }

  ngOnDestroy() {
    this._errorSubscription.unsubscribe();
  }
}
