import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectAccount } from 'src/app/ngrx/account/account.feature';
import { loadFavorites } from 'src/app/ngrx/reviews/reviews.actions';
import { selectFavorites, selectLoadStatus } from 'src/app/ngrx/reviews/reviews.feature';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.sass']
})
export class FavoritesComponent {
  loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  favorites$: Observable<Review[] | [] | null> = this._store.select(selectFavorites);
  accountData$: Observable<Customer | null> = 
    this._store.select(selectAccount);
  private _subscription = Subscription.EMPTY;

  constructor(
    private _store: Store<AppState>
  ) { }

  ngOnInit() {
    this._subscription = this.accountData$.subscribe(customer => {
      if (customer?.id) {
        this._store.dispatch(loadFavorites({ customerId: customer.id }));
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
