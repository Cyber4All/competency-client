import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DropdownType } from 'entity/dropdown';

@Component({
  selector: 'cc-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  loading = true;

  constructor() { }

  dropdownType = DropdownType;

  // Selected Filters
  selectedStatuses: string[] = [];
  selectedWorkroles: string[] = [];
  selectedTasks: string[] = [];
  selectedAudiences: string[] = [];

  ngOnInit(): void {
  }

  filter() {
    // TODO: Implement filtering
    // Emit the selected filters
    // this.filterCompetencies.emit({
    //   status: this.selectedStatuses,
    //   workrole: this.selectedWorkroles,
    //   task: this.selectedTasks,
    //   audience: this.selectedAudiences
    // });
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
