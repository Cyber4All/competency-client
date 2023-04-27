import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cc-primary-nav',
  templateUrl: './primary-nav.component.html',
  styleUrls: ['./primary-nav.component.scss']
})
export class PrimaryNavComponent implements OnInit {

  @Input() isAdmin = false;
  @Output() search = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  sendSearch(value: any) {
    this.search.emit(value);
  }

}
