import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist/wishlist.component';
import { StoreModule } from '@ngrx/store';
import { wishlistFeature } from '../ngrx/wishlist/wishlist.feature';
import { EffectsModule } from '@ngrx/effects';
import { WishlistEffects } from '../ngrx/wishlist/wishlist.effects';

@NgModule({
  declarations: [
    WishlistComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(wishlistFeature),
    EffectsModule.forFeature(WishlistEffects)
  ]
})
export class WishlistModule { }
