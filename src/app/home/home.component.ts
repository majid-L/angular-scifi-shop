import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCategories, selectCategoriesLoadStatus, selectSuppliers, selectSuppliersLoadStatus } from '../ngrx/categories/categories.feature';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  categories$: Observable<Category[] | null> = this._store.select(selectCategories);
  suppliers$: Observable<Supplier[] | null> = this._store.select(selectSuppliers);
  categoriesLoadStatus$: Observable<Status> = this._store.select(selectCategoriesLoadStatus);
  suppliersLoadStatus$: Observable<Status> = this._store.select(selectSuppliersLoadStatus);

  constructor (
    private _store: Store<AppState>
  ) {}

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }
}