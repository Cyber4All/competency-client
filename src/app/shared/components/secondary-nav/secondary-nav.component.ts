import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DropdownType } from '../../entity/dropdown';
import { Source } from '../../entity/behavior';

@Component({
  selector: 'cc-secondary-nav',
  templateUrl: './secondary-nav.component.html',
  styleUrls: ['./secondary-nav.component.scss']
})
export class SecondaryNavComponent implements OnInit {
  @Input() disabled: boolean;
  @Output() newCompetency = new EventEmitter();
  @Output() getHelp = new EventEmitter();
  @Output() filterCompetencies = new EventEmitter<{
    status: string[],
    source: string[],
    workrole: string[],
    task: string[],
    audience: string[]
  }>();

  dropdownType = DropdownType;
  areFiltersCleared = true;
  frameworkSource = undefined as Source | undefined;
  // Selected Filters
  selectedStatuses: string[] = [];
  selectedWorkroles: string[] = [];
  selectedSource: string[] = [];
  selectedTasks: string[] = [];
  selectedAudiences: string[] = [];

  constructor() { }

  ngOnInit(): void { }

  filter() {
    // Emit the selected filters
    this.filterCompetencies.emit({
      status: this.selectedStatuses,
      source: this.selectedSource,
      workrole: this.selectedWorkroles,
      task: this.selectedTasks,
      audience: this.selectedAudiences
    });
  }

  // Functions to set the selected filters upon change
  statuses(statuses: string[]) {
    this.areFiltersCleared = statuses.length === 0;
    this.selectedStatuses = statuses;
    this.filter();
  }
  source(source: string[]) {
    this.areFiltersCleared = source.length === 0;
    this.selectedSource = source;
    this.frameworkSource = source[0] as Source;
    this.filter();
  }
  workroles(workroles: string[]) {
    this.areFiltersCleared = workroles.length === 0;
    this.selectedWorkroles = workroles;
    this.filter();
  }
  tasks(tasks: string[]) {
    this.areFiltersCleared = tasks.length === 0;
    this.selectedTasks = tasks;
    this.filter();
  }
  audiences(audiences: string[]) {
    this.areFiltersCleared = audiences.length === 0;
    this.selectedAudiences = audiences;
    this.filter();
  }
  clearFilters() {
    // If all filters are already cleared, do nothing
    if (this.selectedStatuses.length === 0 &&
      (this.selectedSource.length === 0) &&
      this.selectedWorkroles.length === 0 &&
      this.selectedTasks.length === 0 &&
      this.selectedAudiences.length === 0) {
      return;
    }
    this.selectedStatuses = [];
    this.selectedSource = [];
    this.frameworkSource = undefined;
    this.selectedWorkroles = [];
    this.selectedTasks = [];
    this.selectedAudiences = [];
    this.areFiltersCleared = true;
    this.filter();
  }
}
