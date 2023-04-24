import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DropdownType } from '../../../../entity/dropdown';

@Component({
  selector: 'cc-secondary-nav',
  templateUrl: './secondary-nav.component.html',
  styleUrls: ['./secondary-nav.component.scss']
})
export class SecondaryNavComponent implements OnInit {

  @Output() newCompetency = new EventEmitter();
  @Output() getHelp = new EventEmitter();
  @Output() filterCompetencies = new EventEmitter<{ status: string[], workrole: string[], task: string[], audience: string[]}>();

  dropdownType = DropdownType;

  // Selected Filters
  selectedStatuses: string[] = [];
  selectedWorkroles: string[] = [];
  selectedTasks: string[] = [];
  selectedAudiences: string[] = [];

  constructor() { }

  ngOnInit(): void {}

  filter() {
    // Emit the selected filters
    this.filterCompetencies.emit({
      status: this.selectedStatuses,
      workrole: this.selectedWorkroles,
      task: this.selectedTasks,
      audience: this.selectedAudiences
    });
  }

  // Functions to set the selected filters upon change
  statuses(statuses: string[]) {
    this.selectedStatuses = statuses;
    this.filter();
  }
  workroles(workroles: string[]) {
    this.selectedWorkroles = workroles;
    this.filter();
  }
  tasks(tasks: string[]) {
    this.selectedTasks = tasks;
    this.filter();
  }
  audiences(audiences: string[]) {
    this.selectedAudiences = audiences;
    this.filter();
  }
}
