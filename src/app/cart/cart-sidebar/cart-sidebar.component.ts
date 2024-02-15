import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subscription, EMPTY } from 'rxjs';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.sass'],
})
export class CartSidebarComponent implements AfterViewInit {
  @Input() events: Observable<void> = EMPTY;
  @ViewChild(MatSidenav) cart: MatSidenav | undefined;
  private _eventsSubscription: Subscription = Subscription.EMPTY;

  ngAfterViewInit() {
    this._eventsSubscription = this.events.subscribe(() => {
      this.cart?.open();
    });
  }

  ngOnDestroy() {
    this._eventsSubscription.unsubscribe();
  }

  toggleBodyOverflow(state: "hide" | "show") {
    if (state === "hide") {
      document.body.classList.add("hide-scrollbar");
    } else {
      document.body.classList.remove("hide-scrollbar");
    }
  }
}
