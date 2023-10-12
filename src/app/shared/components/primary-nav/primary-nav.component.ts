import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackbarService } from 'app/core/snackbar.service';
import { SNACKBAR_COLOR } from '../snackbar/snackbar.component';

@Component({
  selector: 'cc-primary-nav',
  templateUrl: './primary-nav.component.html',
  styleUrls: ['./primary-nav.component.scss']
})
export class PrimaryNavComponent implements OnInit {

  @Input() isAdmin = false;
  @Output() search = new EventEmitter<string>();
  constructor(
    private snackBarService: SnackbarService,
  ) { }

  ngOnInit(): void { }

  sendSearch(value: any) {
    this.search.emit(value);
  }

  /**
   * Copies an email to the clipboard
   */
  copyEmail() {
    const range = document.createRange();
    range.selectNode(document.getElementById('email'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    this.snackBarService.notification$.next({
      message: 'Email copied!',
      title: 'Success',
      color: SNACKBAR_COLOR.SUCCESS
    });
  }

}
