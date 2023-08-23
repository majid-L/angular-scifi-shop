import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account/account.component';
import { CheckoutComponent } from './checkout/checkout/checkout.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { SingleOrderComponent } from './orders/single-order/single-order.component';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "products", component: ProductListComponent },
  { path: "account", component: AccountComponent},
  { path: "orders", component: OrdersComponent },
  { path: "orders/:id", component: SingleOrderComponent },
  { path: "checkout", component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
