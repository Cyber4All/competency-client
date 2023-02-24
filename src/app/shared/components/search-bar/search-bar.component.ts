import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'cc-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchValue = '';
  textQuery!: boolean;

  destroyed$: Subject<void> = new Subject();

  @Output() search = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    // force search bar to reflect current search
    this.router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      takeUntil(this.destroyed$)
    ).subscribe((x: any) => {
      const textParam = this.route.snapshot.queryParamMap.get('text');

      // if we're on the dashboard check if there are filter values to be had
      if (x.url.match(/\/dashboard.*/)) {
        if (textParam) {
          this.searchValue = textParam;
        } else {
          this.searchValue = '';
        }
      }
    });
  }

  togglePlaceholder() {
    if (this.searchValue.length === 0) {
      (document.getElementById('cc-search-input') as HTMLInputElement).placeholder = 'Search...';
    }
  }

  /**
   * Takes a reference to the searchbar input to pass as a query to the browse component.
   *
   * @param searchbar reference to input
   */
  performSearch(searchbar: any) {
    searchbar.value = searchbar.value.trim();
    const text = searchbar.value;
    if (text.length) {
      searchbar.blur();
      // Pass value to page performing search
      this.search.emit(text);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }

}
