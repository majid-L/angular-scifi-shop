import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "products", component: ProductListComponent },
  { path: "products/:id", component: SingleProductComponent },
  { path: "account", component: AccountComponent},
  { path: "wishlist", component: WishlistComponent },
  { path: "orders", component: OrdersComponent },
  { path: "orders/new", component: NewOrderRedirectComponent },
  { path: "orders/:id", component: SingleOrderComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
