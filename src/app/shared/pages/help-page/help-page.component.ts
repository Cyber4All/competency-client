import { Component, OnInit } from '@angular/core';
import { sections } from './copy';
@Component({
  selector: 'cc-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  title = 'Competency Constructor Help';

  get tabs() {
    return Object.values(sections);
  }

}
