import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews/reviews.component';
import { MaterialModule } from '../material/material.module';
import { EffectsModule } from '@ngrx/effects';
import { ReviewsEffects } from '../ngrx/reviews/reviews.effects';
import { StoreModule } from '@ngrx/store';
import { reviewsFeature } from '../ngrx/reviews/reviews.feature';
import { NgLetModule } from 'ng-let';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReviewsComponent,
    ReviewDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgLetModule,
    ReactiveFormsModule,
    StoreModule.forFeature(reviewsFeature),
    EffectsModule.forFeature(ReviewsEffects)
  ],
  exports: [
    ReviewsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewsModule { }
