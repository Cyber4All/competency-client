import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompetencyBuilder } from 'src/app/core/builder/competency-builder.class';
import { Competency } from 'src/entity/competency';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  updateSubmission = new EventEmitter();
  @Input() competency!: CompetencyBuilder;

  constructor() { }

  ngOnInit(): void {
  }

  onUpdateSubmission(): void {
    this.updateSubmission.emit();
  }

}
