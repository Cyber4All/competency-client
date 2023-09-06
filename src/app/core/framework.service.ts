import { Injectable } from '@angular/core';
import { Source } from '../shared/entity/behavior';
import { NiceWorkroleService } from './nice.workrole.service';
import { DcwfWorkroleService } from './dcwf.workrole.service';
import { SnackbarService } from './snackbar.service';
import { SNACKBAR_COLOR } from '../shared/components/snackbar/snackbar.component';
import { Workrole } from '../shared/entity/nice.workrole';
import { DCWF_Workrole } from '../shared/entity/dcwf.workrole';
import { Elements } from '../shared/entity/nice.elements';
import { DCWF_Element } from '../shared/entity/dcwf.elements';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {

  workroles: BehaviorSubject<(Workrole | DCWF_Workrole)[]> = new BehaviorSubject<(Workrole | DCWF_Workrole)[]>([]);
  tasks: BehaviorSubject<(Elements | DCWF_Element)[]> = new BehaviorSubject<(Elements | DCWF_Element)[]>([]);
  private _currentFramework: Source;
  get currentFramework(): Source {
    return this._currentFramework;
  }
  set currentFramework(source: Source) {
    this._currentFramework = source;
  }
  constructor(
    private niceService: NiceWorkroleService,
    private dcwfService: DcwfWorkroleService,
    private snackbarService: SnackbarService
  ) { }

  async getCompleteTask(task: string) {
    switch (this.currentFramework) {
      case Source.NICE:
        return await this.niceService.getCompleteTask(task);
      case Source.DCWF:
        return await this.dcwfService.getCompleteTask(task);
      default:
        this.throwFrameworkError();
    }
  }
  async getCompleteWorkrole(work_role: string) {
    switch (this.currentFramework) {
      case Source.NICE:
        return await this.niceService.getCompleteWorkrole(work_role);
      case Source.DCWF:
        return await this.dcwfService.getCompleteWorkrole(work_role);
      default:
        this.throwFrameworkError();
    }
  }
  async getAllTasks() {
    this.tasks.next([]);
    switch (this.currentFramework) {
      case Source.NICE:
        await this.niceService.getAllTasks();
        this.niceService.tasks.subscribe((tasks: Elements[]) => {
          this.tasks.next(tasks);
        });
        break;
      case Source.DCWF:
        await this.dcwfService.getAllTasks();
        this.dcwfService.tasks.subscribe((tasks: DCWF_Element[]) => {
          this.tasks.next(tasks);
        });
        break;
      default:
        this.throwFrameworkError();
    }
  }
  async getAllWorkroles() {
    this.workroles.next([]);
    switch (this.currentFramework) {
      case Source.NICE:
        await this.niceService.getAllWorkroles();
        this.niceService.workroles.subscribe((workroles: Workrole[]) => {
          this.workroles.next(workroles);
        });
        break;
      case Source.DCWF:
        await this.dcwfService.getAllWorkroles();
        this.dcwfService.workroles.subscribe((workroles: DCWF_Workrole[]) => {
          this.workroles.next(workroles);
        });
        break;
      default:
        this.throwFrameworkError();
    }
  }
  async searchTasks(query: string) {
    switch (this.currentFramework) {
      case Source.NICE:
        return await this.niceService.searchTasks(query);
      case Source.DCWF:
        return await this.dcwfService.searchTasks(query);
      default:
        this.throwFrameworkError();
    }
  }

  async searchWorkroles(query: string) {
    switch (this.currentFramework) {
      case Source.NICE:
        return await this.niceService.searchWorkroles(query);
      case Source.DCWF:
        return await this.dcwfService.searchWorkroles(query);
      default:
        this.throwFrameworkError();
    }
  }

  private throwFrameworkError() {
    this.snackbarService.notification$.next({
      title: 'Oops!',
      message: 'A workforce framework has not been selected.',
      color: SNACKBAR_COLOR.DANGER
    });
  }
}
