import { createAction, props } from "@ngrx/store";

export const loadProductReviews = createAction(
  "[Reviews Component] Load Product Reviews",
  props<{ productId: number }>()
);
export const loadProductReviewsSuccess = createAction(
  "[Reviews Component] Load Product Reviews - Success",
  props<ReviewsResponse>()
);

export const loadCustomerReviews = createAction(
  "[Reviews Component] Load Customer Reviews",
  props<{ customerId: number }>()
);
export const loadCustomerReviewsSuccess = createAction(
  "[Reviews Component] Load Customer Reviews - Success",
  props<ReviewsResponse>()
);

export const loadFavorites = createAction(
  "[Favorites Component] Load Favorites",
  props<{ customerId: number }>()
);
export const loadFavoritesSuccess = createAction(
  "[Favorites Component] Load Favorites - Success",
  props<FavoritesResponse>()
);

export const createReview = createAction(
  "[Reviews Component] Create Review - Loading",
  props<NewReviewRequest>()
);
export const createReviewSuccess = createAction(
  "[Reviews Component] Create Review - Success",
  props<{ newReview: Review }>()
);

export const updateReview = createAction(
  "[Reviews Component] Update Review - Loading",
  props<{ 
    reviewId: number, 
    requestBody: UpdateReviewRequest 
  }>()
);
export const updateReviewSuccess = createAction(
  "[Reviews Component] Update Review - Success",
  props<{ updatedReview: Review }>()
);

export const deleteReview = createAction(
  "[Reviews Component] Delete Review - Loading",
  props<{ reviewId: number }>()
);
export const deleteReviewSuccess = createAction(
  "[Reviews Component] Delete Review - Success",
  props<{ deletedReview: Review }>()
);

export const resetReviewsStatus = createAction("[Reviews Component] Reset Status");

export const updateActiveId = createAction(
  "[Reviews Component] Update Active Id",
  props<{ activeId: number }>()
);