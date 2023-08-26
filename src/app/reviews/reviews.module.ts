import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews/reviews.component';
import { MaterialModule } from '../material/material.module';
import { EffectsModule } from '@ngrx/effects';
import { ReviewsEffects } from '../ngrx/reviews/reviews.effects';
import { StoreModule } from '@ngrx/store';
import { reviewsFeature } from '../ngrx/reviews/reviews.feature';

@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    StoreModule.forFeature(reviewsFeature),
    EffectsModule.forFeature(ReviewsEffects)
  ],
  exports: [
    ReviewsComponent
  ]
})
export class ReviewsModule { }
