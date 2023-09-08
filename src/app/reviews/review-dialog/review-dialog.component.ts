import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { createReview, deleteReview, resetReviewsStatus, updateActiveId, updateReview } from 'src/app/ngrx/reviews/reviews.actions';
import { selectReviewStatus } from 'src/app/ngrx/reviews/reviews.feature';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.sass']
})
export class ReviewDialogComponent {
  reviewForm = this._formBuilder.group({
    title: [this.data.review.title, Validators.required],
    body: [this.data.review.body, Validators.required],
    recommend: [this.data.review.recommend],
    rating: [this.data.review.rating, Validators.required]
  });
  private readonly _reviewStatus$: Observable<Status> = 
    this._store.select(selectReviewStatus);
  private _reviewStatusSubscription = Subscription.EMPTY;
  private _accountDataSubscription = Subscription.EMPTY;
  showLoadingBar = false;

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      review: Review, 
      operation: "create" | "update" 
    },
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this._reviewStatusSubscription = this._reviewStatus$
      .subscribe(status => {
        if (status === "success" || status === "error") {
          this.dialogRef.close();
        }
        if (status === "loading") {
          this.showLoadingBar = true;
        }
      });
  }

  changeRating(e: CustomEvent<number>) {
    this.reviewForm.patchValue({
      rating: e.detail as Rating
    });
  }

  clearField(field: string, value: string | null) {
    this.reviewForm.patchValue({ [field]: value });
  }

  submitReview(): void {
    this._store.dispatch(updateActiveId({ activeId: this.data.review.id }));
    if (this.data.operation === "update") {
      this._store.dispatch(updateReview({
        reviewId: this.data.review.id,
        requestBody: this.reviewForm.value as UpdateReviewRequest
      }));
    }
    if (this.data.operation === "create") {
      const requestBody = {
        customerId: this.data.review.customerId,
        orderId: this.data.review.orderId,
        productId: this.data.review.productId,
        ...this.reviewForm.value
      };
      this._store.dispatch(createReview(requestBody as NewReviewRequest));
    }
  }

  deleteReview(reviewId: number) {
    this._store.dispatch(resetReviewsStatus());
    this._store.dispatch(deleteReview({ reviewId }));
  }

  ngOnDestroy() {
    this._reviewStatusSubscription.unsubscribe();
    this._accountDataSubscription.unsubscribe();
  }
}
