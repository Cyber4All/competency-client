import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompetencyBuilder } from 'src/app/core/builder/competency-builder.class';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  @Output() updateSubmission = new EventEmitter();

  @Input() competency!: CompetencyBuilder;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onUpdateSubmission(): void {
    this.close.emit();
    this.updateSubmission.emit();
  }

}
