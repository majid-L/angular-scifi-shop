import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loadProducts, setSearchTerm } from '../ngrx/products/products.actions';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent {
  productName = "";

  constructor(
    private _store: Store<AppState>
  ) { }

  search(searchForm: NgForm) {
    if (!this.productName?.trim()) return;
    this._store.dispatch(setSearchTerm({ searchTerm: this.productName }));
    this._store.dispatch(loadProducts({
      product: this.productName
    }));
    searchForm.reset();
  }
}