import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account/account.component';
import { CheckoutComponent } from './checkout/checkout/checkout.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { SingleOrderComponent } from './orders/single-order/single-order.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewOrderRedirectComponent } from './orders/new-order-redirect/new-order-redirect.component';
import { SingleProductComponent } from './products/single-product/single-product.component';
import { WishlistComponent } from './wishlist/wishlist/wishlist.component';
import { CartPageComponent } from './cart/cart-page/cart-page.component';
import { FavoritesComponent } from './products/favorites/favorites.component';
import { ReviewsPageComponent } from './reviews/reviews-page/reviews-page.component';
import { AuthService } from './auth/auth.service';

const authenticationGuard: CanActivateFn = () => {
  const loggedInUserId = inject(AuthService).loggedInUserId;
  if (!loggedInUserId) {
    return inject(Router).createUrlTree(["/"]);
  } else {
    return true;
  }
}

const routes: Routes = [
  { 
    path: "", 
    title: "Boom's Black Market", 
    component: HomeComponent
  },
  { 
    path: "products",
    component: ProductListComponent 
  },
  { 
    path: "products/:id", 
    component: SingleProductComponent 
  },
  { 
    path: "account",
    title: "My account", 
    component: AccountComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "cart", 
    title: "My cart", 
    component: CartPageComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "wishlist", 
    title: "My wishlist", 
    component: WishlistComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "favorites", 
    title: "My favorites", 
    component: FavoritesComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "reviews", 
    title: "Product reviews",
    component: ReviewsPageComponent 
  },
  { 
    path: "orders", 
    title: "My orders", 
    component: OrdersComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "orders/new",
    title: "New order",
    component: NewOrderRedirectComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "orders/:id",
    title: "Single order",
    component: SingleOrderComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "checkout", 
    title: "Checkout", component: CheckoutComponent,
    canActivate: [authenticationGuard]
  },
  { 
    path: "**", 
    title: "Not found",
    component: PageNotFoundComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
