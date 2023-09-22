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
import { CheckoutModule } from './checkout/checkout.module';
import { accountFeature } from './ngrx/account/account.feature';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdersModule } from './orders/orders.module';
import { notificationFeature } from './ngrx/notification/notification.feature';
import { categoriesFeature } from './ngrx/categories/categories.feature';
import { CategoriesEffects } from './ngrx/categories/categories.effects';
import { WishlistModule } from './wishlist/wishlist.module';
import { wishlistFeature } from './ngrx/wishlist/wishlist.feature';
import { WishlistEffects } from './ngrx/wishlist/wishlist.effects';
import { SearchComponent } from './search/search.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    DialogComponent
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
    WishlistModule,
    CheckoutModule,
    OrdersModule,
    MaterialModule,
    SearchComponent,
    NgLetModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(categoriesFeature),
    StoreModule.forFeature(accountFeature),
    StoreModule.forFeature(wishlistFeature),
    StoreModule.forFeature(notificationFeature),
    EffectsModule.forFeature(CategoriesEffects),
    EffectsModule.forFeature(WishlistEffects),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent, FooterComponent]
})
export class AppModule { }
