import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DropdownType } from '../../entity/dropdown';
import { Lifecycles } from '../../entity/lifecycles';
import { Workrole } from '../../entity/nice.workrole';
import { Elements } from '../../entity/nice.elements';
import { FrameworkService } from '../../../core/framework.service';
import { Source } from '../../entity/behavior';
import { DCWF_Element } from '../../entity/dcwf.elements';
import { DCWF_Workrole } from '../../entity/dcwf.workrole';

@Component({
  selector: 'cc-filtering-dropdowns',
  templateUrl: './filtering-dropdowns.component.html',
  styleUrls: ['./filtering-dropdowns.component.scss']
})
export class FilteringDropdownsComponent implements OnInit, OnChanges {

  @Input() title = '';
  @Input() disabled = false;
  @Input() frameworkSource: Source | undefined;
  @Output() selectedEmitter = new EventEmitter<string[]>();
  @Input() clearFilters = true;
  // All items to be displayed in the dropdown
  items: {
    id: string,  // Either the id of the workrole or task, or the value of the Lifecycles enum
    name: string // Either the name of the workrole or task, or the value of the Lifecycles enum
  }[] = [];

  // filtered workroles items
  filteredItems: {
    id: string,  // Either the id of the workrole or task, or the value of the Lifecycles enum
    name: string // Either the name of the workrole or task, or the value of the Lifecycles enum
  }[] = [];

  // Active items selected in the dropdown
  // This is an array of ids (either the id of the workrole or task, or the value of the Lifecycles enum)
  selectedItems: string[] = [];

  // Determines whether or not the shared search bar should be displayed
  searchbar = false;

  // The direction of the icon arrow, changes on click (true is down, false is up)
  iconArrowDown = true;

  /**
   * TODO:// Add loading spinner for drops
   */

  constructor(
    private frameworkService: FrameworkService
  ) { }

  async ngOnInit(): Promise<void> {
    // if title is Workrole or Task, then shared search bar should be used
    this.searchbar = this.title === DropdownType.WORKROLE || this.title === DropdownType.TASK;
    // Set items based on the type of the dropdown
    switch (this.title) {
      case DropdownType.STATUS:
        // Set items to the value of the Lifecycles enum
        Object.values(Lifecycles).forEach((value: string) => {
          this.items.push({ id: value, name: value });
        });
        break;
      case DropdownType.SOURCE:
        // Set items to the value of the framework enum
        Object.values(Source).forEach((value: string) => {
          this.items.push({ id: value, name: value });
        });
        break;
      case DropdownType.ACTOR:
        // Set items to a list of audiences
        this.items = [];
        break;
    }
  }

  /**
   * Updates the selectedItems array when the clearFilters input changes to true
   *
   * @param changes the changes to the component
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearFilters && changes.clearFilters.currentValue) {
      this.selectedItems = [];
    }
    if (changes.frameworkSource && changes.frameworkSource.currentValue !== undefined) {
      this.items = [];
      this.filteredItems = [];
      this.frameworkService.currentFramework = this.frameworkSource;
      if (this.title === DropdownType.WORKROLE) {
        // Set items to the workroles returned from the API
        this.frameworkService.getAllWorkroles();
        // Subscribe to the workroles observables
        this.frameworkService.workroles.subscribe((workroles: (Workrole | DCWF_Workrole)[]) => {
          workroles.forEach((workrole: Workrole | DCWF_Workrole) => {
            this.filteredItems.push({ id: workrole._id, name: workrole.work_role });
          });
          this.items = this.filteredItems;
        });
      }
      if (this.title === DropdownType.TASK) {
        this.frameworkService.getAllTasks();
        // Subscribe to task observable
        this.frameworkService.tasks.subscribe((tasks: (Elements | DCWF_Element)[]) => {
          tasks.forEach((task: Elements | DCWF_Element) => {
            this.items.push({ id: task._id, name: `${task.element_id} - ${task.description}` });
          });
        });
      }
    }
  }

  /**
   * Adds/Removes an item from the selectedItems array
   *
   * @param item a single item from the items array
   */
  toggleFilterItem(item: { id: string, name: string }) {
    if (!this.selectedItems.includes(item.id)) {
      // If the dropdown is the source dropdown, clear the selectedItems array; only one source can be selected at a time
      if (this.title === DropdownType.SOURCE) {
        this.selectedItems = [];
      }
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
    return this.selectedItems.includes(item.id) ? { 'color': 'blue' } : { 'color': 'black' };
  }

  /**
   * Filters the dropdown items based on the value of the input field
   *
   * @param value the value of the input field
   */
  filterSearch(value: any) {
    this.items = this.filteredItems.filter((item: any) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });
  }

}
