import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loadProducts, setSearchTerm } from '../ngrx/products/products.actions';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable, shareReplay, Subscription } from 'rxjs';

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
  @HostListener("window:scroll", ["event"]) onScroll() {
    if (!this.isMediumViewport) return;
    if (window.scrollY > this.scrollY) {
      this.hideSearchbar = true;
    } else {
      this.hideSearchbar = false;
    }
    this.scrollY = window.scrollY;
  }
  productName = "";
  scrollY = 0;
  hideSearchbar = false;
  isMediumViewport: boolean | undefined;

  private readonly _mediumViewport$: Observable<boolean> = this._breakpointObserver
    .observe('(max-width: 800px)')
    .pipe(map(result => result.matches), shareReplay());
  private _subscription = Subscription.EMPTY;

  constructor(
    private _store: Store<AppState>,
    private _router: Router,
    private _breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this._subscription = this._mediumViewport$.subscribe(matches => {
      this.isMediumViewport = matches;
    });
  }

  search(searchForm: NgForm) {
    if (!this.productName?.trim()) return;
    this._store.dispatch(setSearchTerm({ searchTerm: this.productName }));
    this._router.navigate(["/products"], {
      queryParams: { product: this.productName },
      queryParamsHandling: "merge"
    });
    searchForm.reset();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}