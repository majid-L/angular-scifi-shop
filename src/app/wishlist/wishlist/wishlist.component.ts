import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectActiveId, selectLoadStatus, selectUpdateStatus, selectWishlist } from 'src/app/ngrx/wishlist/wishlist.feature';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.sass']
})
export class WishlistComponent {
  readonly wishlist$: Observable<Wishlist | null> = this._store.select(selectWishlist);
  readonly loadStatus$: Observable<Status> = this._store.select(selectLoadStatus);
  readonly updateStatus$: Observable<Status> = this._store.select(selectUpdateStatus);
  readonly activeId$: Observable<number> = this._store.select(selectActiveId);
  private _subscription = Subscription.EMPTY;
  operation: "remove" | "removeAll" | undefined;

  constructor(
    private _store: Store<AppState>,
    private _wishlistService: WishlistService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._subscription = this.updateStatus$.subscribe(updateStatus => {
      if (updateStatus === "success") {
        const message = this.operation === "remove" ? "Wishlist item successfully removed." : "All wishlist items have been removed.";
        this._snackBar.open(message, "Dismiss", {
          horizontalPosition: "start",
          verticalPosition: "top",
          duration: 8000
        });
      }
    });
  }

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }

  updateWishlist(operation: "remove" | "removeAll", wishlist: Wishlist, productId: number) {
    this.operation = operation;
    this._wishlistService
      .dispatchWishlistActions(operation, wishlist, productId);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
