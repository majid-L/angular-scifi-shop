import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map } from "rxjs";
import { ReviewsService } from "src/app/reviews/reviews.service";
import { dispatchErrorAction } from "..";
import { 
    createReview, 
    createReviewSuccess, 
    deleteReview, 
    deleteReviewSuccess, 
    loadAllReviews, 
    loadAllReviewsSuccess, 
    loadCustomerReviews, 
    loadCustomerReviewsSuccess, 
    loadFavorites, 
    loadFavoritesSuccess, 
    loadProductReviews, 
    loadProductReviewsSuccess, 
    updateReview,
    updateReviewSuccess
} from "./reviews.actions";

@Injectable()
export class ReviewsEffects {
  $loadAllReviews = createEffect(() => this._actions$.pipe(
    ofType(loadAllReviews),
    exhaustMap(queryParams => {
      return this._reviewsService.getAllReviews(queryParams)
      .pipe(
        map(reviewsResponse => {
          return loadAllReviewsSuccess(reviewsResponse);
        }),
        catchError(dispatchErrorAction)
      )
    })
  ));

  $loadProductReviews = createEffect(() => this._actions$.pipe(
    ofType(loadProductReviews),
    exhaustMap(({ productId, queryParams }) => 
      this._reviewsService.getProductReviews(productId, queryParams)
      .pipe(
        map(reviewsResponse => {
          return loadProductReviewsSuccess(reviewsResponse);
        }),
        catchError(dispatchErrorAction)
      )
    )
  ));

  $loadCustomerReviews = createEffect(() => this._actions$.pipe(
    ofType(loadCustomerReviews),
    exhaustMap(({ customerId, queryParams }) => 
      this._reviewsService.getCustomerReviews(customerId, queryParams)
      .pipe(
        map(reviewsResponse => {
          return loadCustomerReviewsSuccess(reviewsResponse);
        }),
        catchError(dispatchErrorAction)
      )
    )
  ));

  $loadFavorites = createEffect(() => this._actions$.pipe(
    ofType(loadFavorites),
    exhaustMap(({ customerId }) => this._reviewsService.getFavorites(customerId)
      .pipe(
        map(favoritesResponse => {
          return loadFavoritesSuccess(favoritesResponse);
        }),
        catchError(dispatchErrorAction)
      )
    )
  ));

  $createReview = createEffect(() => this._actions$.pipe(
    ofType(createReview),
    exhaustMap(payload => this._reviewsService.createReview(payload)
      .pipe(
        map(newReviewResponse => {
          return createReviewSuccess(newReviewResponse);
        }),
        catchError(dispatchErrorAction)
      )
    )
  ));

  $updateReview = createEffect(() => this._actions$.pipe(
    ofType(updateReview),
    exhaustMap(({ reviewId, requestBody }) => {
      return this._reviewsService.updateReview(reviewId, requestBody)
        .pipe(
          map(updatedReviewResponse => {
            return updateReviewSuccess(updatedReviewResponse);
          }),
          catchError(dispatchErrorAction)
        )
    })
  ));

  $deleteReview = createEffect(() => this._actions$.pipe(
    ofType(deleteReview),
    exhaustMap(({ reviewId }) => this._reviewsService.deleteReview(reviewId)
      .pipe(
        map(deletedReviewResponse => {
          return deleteReviewSuccess(deletedReviewResponse);
        }),
        catchError(dispatchErrorAction)
      )
    )
  ));

  constructor(
    private _actions$: Actions,
    private _reviewsService: ReviewsService
  ) { }
}