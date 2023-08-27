import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from '../ngrx/products/products.effects';
import { MaterialModule } from '../material/material.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { RouterModule } from '@angular/router';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { FormsModule } from '@angular/forms';
import { SingleProductComponent } from './single-product/single-product.component';
import { StoreModule } from '@ngrx/store';
import { productsFeature } from '../ngrx/products/products.feature';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { NgLetModule } from 'ng-let';
import { ReviewsModule } from '../reviews/reviews.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [ProductListComponent, ProductDialogComponent, SingleProductComponent, ActionButtonsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SpinnerModule,
    RouterModule,
    FormsModule,
    NgLetModule,
    ReviewsModule,
    StoreModule.forFeature(productsFeature),
    EffectsModule.forFeature(ProductsEffects)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsModule { }
