import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectReviews, selectLoadStatus } from 'src/app/ngrx/reviews/reviews.feature';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.sass']
})
export class ReviewsComponent {
  readonly reviews$: Observable<Review[] | null> = this._store.select(selectReviews);
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);

  constructor(
    private _store: Store<AppState>
  ) { }
}
