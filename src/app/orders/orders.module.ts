import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { MaterialModule } from '../material/material.module';
import { StoreModule } from '@ngrx/store';
import { ordersFeature } from '../ngrx/orders/orders.feature';
import { EffectsModule } from '@ngrx/effects';
import { OrdersEffects } from '../ngrx/orders/orders.effects';
import { SpinnerModule } from '../spinner/spinner.module';
import { SingleOrderComponent } from './single-order/single-order.component';
import { RouterModule } from '@angular/router';
import { NewOrderRedirectComponent } from './new-order-redirect/new-order-redirect.component';
import { NgLetModule } from 'ng-let';
import { AccountModule } from '../account/account.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    OrdersComponent,
    SingleOrderComponent,
    NewOrderRedirectComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgLetModule,
    SpinnerModule,
    RouterModule,
    AccountModule,
    ReviewsModule,
    PageNotFoundComponent,
    StoreModule.forFeature(ordersFeature),
    EffectsModule.forFeature(OrdersEffects)
  ]
})
export class OrdersModule { }
