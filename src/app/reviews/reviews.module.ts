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
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    ReviewsComponent,
    ReviewDialogComponent,
    ReviewsPageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgLetModule,
    ReactiveFormsModule,
    SpinnerModule,
    PageNotFoundComponent,
    StoreModule.forFeature(reviewsFeature),
    EffectsModule.forFeature(ReviewsEffects)
  ],
  exports: [
    ReviewsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewsModule { }
