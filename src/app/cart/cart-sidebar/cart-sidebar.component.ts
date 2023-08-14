import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { selectCart, selectCartStatus } from 'src/app/ngrx';
import { clearCart } from 'src/app/ngrx/cart/cart.actions';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.sass']
})
export class CartSidebarComponent implements AfterViewInit {
  @Input() events: Observable<void> = EMPTY;
  @ViewChild(MatSidenav) cart: MatSidenav | undefined;
  eventsSubscription: Subscription = Subscription.EMPTY;
  cart$: Observable<Cart | null> = this.store.select(selectCart);
  status$: Observable<CartStatus> = this.store.select(selectCartStatus);
  backdrop = true;

  constructor(private store: Store<AppState>) { }

  ngAfterViewInit() {
    this.eventsSubscription = this.events.subscribe(() => {
      this.cart?.open();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  emptyCart() {
    this.store.dispatch(clearCart());
  }
}