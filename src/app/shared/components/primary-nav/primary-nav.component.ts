import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'cc-primary-nav',
  templateUrl: './primary-nav.component.html',
  styleUrls: ['./primary-nav.component.scss']
})
export class PrimaryNavComponent implements OnInit {

  @Output() search = new EventEmitter<string>();
  constructor( ) { }

  ngOnInit(): void { }

  sendSearch(value: any) {
    this.search.emit(value);
  }

}
