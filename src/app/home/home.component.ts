import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCategories, selectSuppliers } from '../ngrx/categories/categories.feature';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  suppliers$: Observable<Supplier[] | null> = this._store.select(selectSuppliers);
  categories$: Observable<Category[] | null> = this._store.select(selectCategories);

  constructor (
    private _store: Store<AppState>
  ) {}

  get lightModeEnabled() {
    return document.body.classList.contains("light-mode");
  }
}