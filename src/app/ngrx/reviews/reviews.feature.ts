import { createFeature, createReducer, on } from "@ngrx/store"
import { httpError } from "../notification/notification.actions";
import { createReview, createReviewSuccess, deleteReview, deleteReviewSuccess, loadCustomerReviews, loadCustomerReviewsSuccess, loadProductReviews, loadProductReviewsSuccess, resetReviewsStatus, updateReview, updateReviewSuccess } from "./reviews.actions";

export const initialState: ReviewsState = {
  pagination: {
    page: 1,
    count: 0,
    totalResults: 0
  },
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
        pagination: { page, count, totalResults },
        reviews
      }
  }),
  on(createReview, state => ({ ...state, createStatus: "loading" as const })),
  on(createReviewSuccess, (state, payload) => {
    return {
      ...state,
      createStatus: "success" as const,
      pagination: { 
        ...state.pagination, 
        totalResults: state.pagination.totalResults + 1 
      },
      reviews: [...state.reviews!, payload.newReview]
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
      pagination: { 
        ...state.pagination, 
        totalResults: state.pagination.totalResults - 1 
      }
    }
  }),
  on(httpError, state => {
    return {
      ...state,
      loadStatus: "error" as const,
      createStatus: "error" as const,
      updateStatus: "error" as const,
      deleteStatus: "error" as const
    }
  }),
  on(resetReviewsStatus, state => {
    for (const key in state) {
      if (state[key as keyof ReviewsState] === "loading") {
        return state;
      }
    };
    return {
      ...state,
      loadStatus: "pending" as const,
      createStatus: "pending" as const,
      updateStatus: "pending" as const,
      deleteStatus: "pending" as const
    }
  })
);

export const reviewsFeature = createFeature({
  name: "reviews",
  reducer: reviewsReducer
});

export const {
  selectCreateStatus,
  selectDeleteStatus,
  selectLoadStatus,
  selectReviews,
  selectPagination,
  selectSingleReview,
  selectUpdateStatus
} = reviewsFeature;