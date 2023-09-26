import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addExpressCheckoutItem } from 'src/app/ngrx/orders/orders.actions';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.sass']
})
export class ProductDialogComponent {
  quantity: number = 1;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private _store: Store<AppState>,
    private _router: Router
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToCheckout() {
    this._store.dispatch(addExpressCheckoutItem({ 
      product: this.data.product,
      quantity: this.quantity 
    }));
    this._router.navigate(["/checkout"]);
    this.dialogRef.close();
  }
}