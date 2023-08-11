import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from '../ngrx/products/products.effects';
import { MaterialModule } from '../material/material.module';
import { SpinnerComponent } from '../spinner/spinner.component';

@NgModule({
  declarations: [ProductListComponent, SpinnerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    EffectsModule.forFeature(ProductsEffects)
  ]
})
export class ProductsModule { }
