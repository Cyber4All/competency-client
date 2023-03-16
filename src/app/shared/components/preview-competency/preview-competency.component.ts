import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Competency } from 'src/entity/competency';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  @Input() isAdmin = true;
  updateSubmission = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Competency) { }

  ngOnInit(): void {
    this.data.behavior = {
      tasks: ['T0137: Maintain database management systems software.'],
      work_role: 'Database Administrator',
      details: 'yeetus'
    };
  }

  onUpdateSubmission(): void {
    this.updateSubmission.emit();
  }

}
