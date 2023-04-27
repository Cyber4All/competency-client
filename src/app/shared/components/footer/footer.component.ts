
import { Component, OnInit } from '@angular/core';
import { COPY } from './footer.copy';

@Component({
  selector: 'cc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  copy = COPY;

  constructor() { }

  ngOnInit() { }

}
