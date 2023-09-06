import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgLetModule } from 'ng-let';

import { reducers, metaReducers } from './ngrx';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { AccountModule } from './account/account.module';
import { DialogComponent } from './dialog/dialog.component';
import { CartModule } from './cart/cart.module';
import { CartSidebarComponent } from './cart/cart-sidebar/cart-sidebar.component';
import { cartFeature } from './ngrx/cart/cart.feature';
import { CheckoutModule } from './checkout/checkout.module';
import { accountFeature } from './ngrx/account/account.feature';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdersModule } from './orders/orders.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { notificationFeature } from './ngrx/notification/notification.feature';
import { categoriesFeature } from './ngrx/categories/categories.feature';
import { CategoriesEffects } from './ngrx/categories/categories.effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    CartSidebarComponent,
    DialogComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    AuthModule,
    ProductsModule,
    AccountModule,
    CartModule,
    CheckoutModule,
    OrdersModule,
    MaterialModule,
    NgLetModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(categoriesFeature),
    StoreModule.forFeature(accountFeature),
    StoreModule.forFeature(cartFeature),
    StoreModule.forFeature(notificationFeature),
    EffectsModule.forFeature(CategoriesEffects),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
