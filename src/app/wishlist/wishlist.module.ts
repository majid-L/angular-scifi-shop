import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist/wishlist.component';
import { StoreModule } from '@ngrx/store';
import { wishlistFeature } from '../ngrx/wishlist/wishlist.feature';
import { EffectsModule } from '@ngrx/effects';
import { WishlistEffects } from '../ngrx/wishlist/wishlist.effects';
import { MaterialModule } from '../material/material.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { NgLetModule } from 'ng-let';
import { ProductsModule } from '../products/products.module';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    WishlistComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SpinnerModule,
    NgLetModule,
    ProductsModule,
    AppRoutingModule,
    StoreModule.forFeature(wishlistFeature),
    EffectsModule.forFeature(WishlistEffects)
  ]
})
export class WishlistModule { }
