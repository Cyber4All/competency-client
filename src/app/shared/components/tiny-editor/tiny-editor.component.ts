import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'cc-tiny-editor',
  templateUrl: './tiny-editor.component.html',
  styleUrls: ['./tiny-editor.component.scss']
})
export class TinyEditorComponent implements OnInit {
  tinyKey = environment.tinyKey;
  @Input() placeholder;
  @Input() data;

  constructor() { }

  ngOnInit(): void { }
}
