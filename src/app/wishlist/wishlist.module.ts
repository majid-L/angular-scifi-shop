import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist/wishlist.component';
import { StoreModule } from '@ngrx/store';
import { wishlistFeature } from '../ngrx/wishlist/wishlist.feature';
import { EffectsModule } from '@ngrx/effects';
import { WishlistEffects } from '../ngrx/wishlist/wishlist.effects';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    WishlistComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    StoreModule.forFeature(wishlistFeature),
    EffectsModule.forFeature(WishlistEffects)
  ]
})
export class WishlistModule { }
