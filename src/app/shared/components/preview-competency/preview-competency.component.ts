import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Competency } from 'src/entity/competency';

@Component({
  selector: 'cc-preview-competency',
  templateUrl: './preview-competency.component.html',
  styleUrls: ['./preview-competency.component.scss']
})
export class PreviewCompetencyComponent implements OnInit {

  updateSubmission = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Competency) { }

  ngOnInit(): void {
  }

  onUpdateSubmission(): void {
    this.updateSubmission.emit();
  }

}
