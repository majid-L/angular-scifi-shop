import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { EffectsModule } from '@ngrx/effects';
import { CartEffects } from '../ngrx/cart/cart.effects';
import { StoreModule } from '@ngrx/store';
import { cartFeature } from '../ngrx/cart/cart.feature';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    StoreModule.forFeature(cartFeature),
    EffectsModule.forFeature(CartEffects)
  ]
})
export class CartModule { }