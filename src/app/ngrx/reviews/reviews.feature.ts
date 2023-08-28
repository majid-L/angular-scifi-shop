import { createFeature, createReducer, on } from "@ngrx/store"
import { createReview, createReviewSuccess, deleteReview, deleteReviewSuccess, loadCustomerReviews, loadCustomerReviewsSuccess, loadProductReviews, loadProductReviewsSuccess, updateReview, updateReviewSuccess } from "./reviews.actions";

export const initialState: ReviewsState = {
  page: null,
  count: null,
  totalResults: null,
  reviews: null,
  singleReview: null,
  loadStatus: "pending",
  createStatus: "pending",
  updateStatus: "pending",
  deleteStatus: "pending"
}

export const reviewsReducer = createReducer(
  initialState,
  on(
    loadCustomerReviews, 
    loadProductReviews, 
    state => ({ ...state, loadStatus: "loading" as const })
  ),
  on(
    loadCustomerReviewsSuccess, 
    loadProductReviewsSuccess, 
    (state, { page, count, totalResults, reviews }) => {
      return {
        ...state,
        loadStatus: "success" as const,
        page,
        count,
        totalResults,
        reviews
      }
  }),
  on(createReview, state => ({ ...state, createStatus: "loading" as const })),
  on(createReviewSuccess, (state, payload) => {
    return {
      ...state,
      createStatus: "success" as const,
      reviews: [...state.reviews!, payload.newReview],
      totalResults: state.totalResults! + 1
    }
  }),
  on(updateReview, state => ({ ...state, updateStatus: "loading" as const })),
  on(updateReviewSuccess, (state, { updatedReview }) => {
    return {
      ...state,
      updateStatus: "success" as const,
      reviews: state.reviews!.map(review => {
        if (review.id === updatedReview.id) {
          return { ...review, ...updatedReview };
        }
        return review;
      })
    }
  }),
  on(deleteReview, state => ({ ...state, deleteStatus: "loading" as const })),
  on(deleteReviewSuccess, (state, payload) => {
    return {
      ...state,
      deleteStatus: "success" as const,
      reviews: state.reviews!.filter(review => {
        return review.id !== payload.deletedReview.id;
      }),
      totalResults: state.totalResults! - 1
    }
  })
);

export const reviewsFeature = createFeature({
  name: "reviews",
  reducer: reviewsReducer
});

export const {
  selectCount,
  selectCreateStatus,
  selectDeleteStatus,
  selectLoadStatus,
  selectPage,
  selectReviews,
  selectSingleReview,
  selectTotalResults,
  selectUpdateStatus
} = reviewsFeature;