import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkroleService } from '../../../core/workrole.service';
import { DropdownType } from '../../../../entity/dropdown';
import { Lifecycles } from '../../../../entity/lifecycles';
import { Workrole } from '../../../../entity/workrole';
import { Elements } from '../../../../entity/elements';

@Component({
  selector: 'cc-filtering-dropdowns',
  templateUrl: './filtering-dropdowns.component.html',
  styleUrls: ['./filtering-dropdowns.component.scss']
})
export class FilteringDropdownsComponent implements OnInit {

  @Input() title = '';
  @Output() selectedEmitter = new EventEmitter<string[]>();

  // All items to be displayed in the dropdown
  items: {
    id: string,  // Either the id of the workrole or task, or the value of the Lifecycles enum
    name: string // Either the name of the workrole or task, or the value of the Lifecycles enum
  }[] = [];

  // Active items selected in the dropdown
  // This is an array of ids (either the id of the workrole or task, or the value of the Lifecycles enum)
  selectedItems: string[] = [];

  // Determines whether or not the shared search bar should be displayed
  searchbar = false;

  constructor(private workroleService: WorkroleService) { }

  async ngOnInit(): Promise<void> {
    // if title is Workrole or Task, then shared search bar should be used
    this.searchbar = this.title === DropdownType.workrole || this.title === DropdownType.task;

    // Set items based on the type of the dropdown
    switch(this.title) {
      case DropdownType.status:
        // Set items to the value of the Lifecycles enum
        Object.values(Lifecycles).forEach((value: string) => {
          this.items.push({ id: value, name: value });
        });
        break;
      case DropdownType.workrole:
        // Set items to the workroles returned from the API
        await this.workroleService.getAllWorkroles().then((workrolesQuery: any) => {
          workrolesQuery.data.workroles.forEach((workrole: Workrole) => {
          this.items.push({ id: workrole._id, name: workrole.work_role });
          });
        });
        break;
      case DropdownType.task:
        // Set items to the tasks returned from the API
        await this.workroleService.getAllTasks().then((tasksQuery: any) => {
          tasksQuery.data.tasks.forEach((task: Elements) => {
            this.items.push({ id: task._id, name: `${task.element_id} - ${task.description}` });
          });
        });
        break;
      case DropdownType.actor:
        // Set items to a list of audiences
        this.items = [];
        break;
    }
  }

  /**
   * Adds/Removes an item from the selectedItems array
   *
   * @param item a single item from the items array
   */
  toggleFilterItem(item: {id: string, name: string}) {
    if (!this.selectedItems.includes(item.id)) {
      // Add item to selectedItems array if it is not already in the array
      this.selectedItems.push(item.id);
    } else {
      // Remove item from selectedItems array if it is already in the array
      this.selectedItems.splice(this.selectedItems.indexOf(item.id), 1);
    }
    // Emit the selectedItems array to the parent component
    this.selectedEmitter.emit(this.selectedItems);
  }

  calculateStyles(item: any) {
    return this.selectedItems.includes(item) ? { 'color': '#376ED6' } : { 'color': '#454545' };
  }

}
