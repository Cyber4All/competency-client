import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'cc-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchValue = '';
  textQuery!: boolean;
  loggedIn = false;
  destroyed$: Subject<void> = new Subject();

  @Output() search = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    ) { }

  ngOnInit() {
    this.authService.isBetaUser.pipe(takeUntil(this.destroyed$)).subscribe((isBetaUser: boolean) => {
      this.loggedIn = isBetaUser;
    });
    // force search bar to reflect current search value
    const textValue = this.route.snapshot.queryParamMap.get('text');
    if(textValue) {
      this.searchValue = textValue;
    }
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
