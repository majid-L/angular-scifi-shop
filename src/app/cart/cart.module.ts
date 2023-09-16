import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { EffectsModule } from '@ngrx/effects';
import { CartEffects } from '../ngrx/cart/cart.effects';
import { StoreModule } from '@ngrx/store';
import { cartFeature } from '../ngrx/cart/cart.feature';
import { CartComponent } from './cart/cart.component';
import { CartSidebarComponent } from './cart-sidebar/cart-sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgLetModule } from 'ng-let';
import { AppRoutingModule } from '../app-routing.module';
import { CartPageComponent } from './cart-page/cart-page.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { ChipsComponent } from '../chips/chips.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    NgLetModule,
    AppRoutingModule,
    SpinnerModule,
    ChipsComponent,
    StoreModule.forFeature(cartFeature),
    EffectsModule.forFeature(CartEffects)
  ],
  declarations: [
    CartComponent,
    CartSidebarComponent,
    CartPageComponent
  ],
  exports: [
    CartSidebarComponent
  ]
})
export class CartModule { }