import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Notes } from 'src/entity/notes';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'cc-notes-builder',
  templateUrl: './notes-builder.component.html',
  styleUrls: ['./notes-builder.component.scss']
})
export class NotesBuilderComponent implements OnInit {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() notes!: Notes;
  @Output() notesChange = new EventEmitter<{update: string, value: Notes}>();
  currIndex: number | null = null;
  details = new FormControl('', [Validators.required]);

  constructor( ) { }

  ngOnInit(): void {
    this.details.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((notesUpdate: string) => {
        this.notesChange.emit({
          update: 'notes',
          value: {
            _id: this.notes._id,
            details: this.details.value
          }
        });
      });
    // If value exists, set details form control
    if (this.notes.details) {
      this.details.patchValue(this.notes.details);
    }
  }
}
