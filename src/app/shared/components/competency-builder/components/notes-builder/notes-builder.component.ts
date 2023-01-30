import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompetencyService } from '../../../../../../app/core/competency.service';
import { Notes } from 'src/entity/notes';
@Component({
  selector: 'cc-notes-builder',
  templateUrl: './notes-builder.component.html',
  styleUrls: ['./notes-builder.component.scss']
})
export class NotesBuilderComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() notes!: Notes;
  @Output() notesChange = new EventEmitter<{update: string, value: Notes}>();
  currIndex: number | null = null;
  details = new FormControl('', [Validators.required]);

  constructor( ) { }

  ngOnInit(): void {
    // If value exists, set details form control
    if (this.notes.details) {
      this.details.patchValue(this.notes.details);
    }
  }

  ngOnChanges(): void {
    // If any value updates, update parent component
    if(this.details.value) {
      this.notesChange.emit({
        update: 'employability',
        value: {
          _id: this.notes._id,
          details: this.details.value
        }
      });
    };
  }
}
