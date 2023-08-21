import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account/account.component';
import { CheckoutComponent } from './checkout/checkout/checkout.component';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "products", component: ProductListComponent },
  { path: "account", component:  AccountComponent},
  { path: "checkout", component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
