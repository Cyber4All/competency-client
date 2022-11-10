import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CompetencyService } from 'src/app/core/competency.service';
import { Employability } from 'src/entity/employability';
@Component({
  selector: 'cc-employability-card',
  templateUrl: './employability-card.component.html',
  styleUrls: ['./employability-card.component.scss']
})
export class EmployabilityCardComponent implements OnInit, OnChanges {

  @Input() competencyId!: string;
  @Input() isEdit = false;
  @Input() employability!: Employability;
  @Output() employabilityChange = new EventEmitter<{update: string, value: Employability}>();
  touched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currIndex: number | null = null;
  details = new FormControl('', [Validators.required]);

  constructor(
    private competencyService: CompetencyService
  ) { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    // If any value updates, update parent component
    if(this.details.value) {
      this.employabilityChange.emit({
        update: 'employability',
        value: {
          _id: this.employability._id,
          details: this.details.value
        }
      });
    };
  }

  /**
   * Method to advance to next step
   */
   async updateEmployability() {
    if(this.details.valid) {
      const res: any = await this.competencyService.updateEmployability(
        this.competencyId,
        {
          _id: this.employability._id,
          details: this.details.value
        }
      );
    }
    this.touched.next(false);
  }
}