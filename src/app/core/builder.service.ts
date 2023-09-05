import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { COMPETENCY_ROUTES } from '../../environments/routes';
import { Actor } from '../../entity/actor';
import { Degree } from '../../entity/degree';
import { Condition } from '../../entity/condition';
import { Behavior } from '../../entity/behavior';
import { Employability } from '../../entity/employability';
import { Notes } from '../../entity/notes';
import { BuilderError, BuilderValidation } from '../../entity/builder-validation';
import { SnackbarService } from './snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class BuilderService {
    private _builderIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private _templateIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private _actorErrors: BehaviorSubject<BuilderValidation[]> = new BehaviorSubject<BuilderValidation[]>([]);
    private _behaviorErrors: BehaviorSubject<BuilderValidation[]> = new BehaviorSubject<BuilderValidation[]>([]);
    private _conditionErrors: BehaviorSubject<BuilderValidation[]> = new BehaviorSubject<BuilderValidation[]>([]);
    private _degreeErrors: BehaviorSubject<BuilderValidation[]> = new BehaviorSubject<BuilderValidation[]>([]);
    private _employabilityErrors: BehaviorSubject<BuilderValidation[]> = new BehaviorSubject<BuilderValidation[]>([]);
    // Builder index observable for child components conditional rendering
    get builderIndex(): Observable<number> {
        return this._builderIndex.asObservable();
    }
    // Builder submenu index observable for child components conditional rendering
    get templateIndex(): Observable<number> {
        return this._templateIndex.asObservable();
    }
    // Errors observable for actor builder
    get actorErrors(): Observable<BuilderValidation[]> {
        return this._actorErrors.asObservable();
    }
    // Errors observable for behavior builder
    get behaviorErrors(): Observable<BuilderValidation[]> {
        return this._behaviorErrors.asObservable();
    }
    // Errors observable for condition builder
    get contextErrors(): Observable<BuilderValidation[]> {
        return this._conditionErrors.asObservable();
    }
    // Errors observable for degree builder
    get degreeErrors(): Observable<BuilderValidation[]> {
        return this._degreeErrors.asObservable();
    }
    // Errors observable for employability builder
    get employabilityErrors(): Observable<BuilderValidation[]> {
        return this._employabilityErrors.asObservable();
    }
    // Updates current builder index
    public setBuilderIndex(value: number) {
        // Disable Rubrics for degree
        if (value === 6) {
            value++;
        }
        this._builderIndex.next(value);
    }
    // Updates current submenu index
    public setTemplateIndex(value: number) {
        this._templateIndex.next(value);
    }
    // Updates current state of builder errors
    public setBuilderErrors(value: BuilderError) {
        this._actorErrors.next([]);
        this._behaviorErrors.next([]);
        this._conditionErrors.next([]);
        this._degreeErrors.next([]);
        this._employabilityErrors.next([]);
        value.errors.map((error: BuilderValidation) => {
            switch(error.type) {
                case 'actor':
                    this._actorErrors.next((this._actorErrors.value, [error]));
                    break;
                case 'behavior':
                    this._behaviorErrors.next((this._behaviorErrors.value, [error]));
                    break;
                case 'condition':
                    this._conditionErrors.next((this._conditionErrors.value, [error]));
                    break;
                case 'degree':
                    this._degreeErrors.next((this._degreeErrors.value, [error]));
                    break;
                case 'employability':
                    this._employabilityErrors.next((this._employabilityErrors.value, [error]));
                    break;
            }
        });
    }
    // Method to clear actor errors
    public clearActorErrors(): void {
        this._actorErrors.next([]);
    }
    // Method to clear behavior errors
    public clearBehaviorErrors(): void {
        this._behaviorErrors.next([]);
    }
    // Method to clear condition errors
    public clearConditionErrors(): void {
        this._conditionErrors.next([]);
    }
    // Method to clear degree errors
    public clearDegreeErrors(): void {
        this._degreeErrors.next([]);
    }
    // Method to clear employability errors
    public clearEmployabilityErrors(): void {
        this._employabilityErrors.next([]);
    }

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private snackBarService: SnackbarService
    ) {}

    /**
     * Method to create the shell of a competency
     *
     * @returns new competency id
     */
    async createCompetency() {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .post(
            COMPETENCY_ROUTES.CREATE_COMPETENCY(),
            {},
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
        });
    }

    /**
     * Method to send actor updates
     *
     * @param competencyId current competency being edited
     * @param actorUpdate updated fields of an actor attribute
     * @returns null for successful request
     */
    async updateActor(competencyId: string, actorUpdate: Actor) {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .patch(
            COMPETENCY_ROUTES.UPDATE_ACTOR(competencyId),
            actorUpdate,
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
            throw e;
        });
    }

    /**
     * Method to send behavior updates
     *
     * @param competencyId current competency being edited
     * @param behaviorUpdate udpated fields of a behavior attribute
     * @returns mull for succesful request
     */
    async updateBehavior(competencyId: string, behaviorUpdate: Partial<Behavior>) {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .patch(
            COMPETENCY_ROUTES.UPDATE_BEHAVIOR(competencyId),
            behaviorUpdate,
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
            throw e;
        });
    }

    /**
     * Method to send condition updates
     *
     * @param competencyId current competncy being edited
     * @param conditionUpdate updated fields of a condition attribute
     * @returns null for successful request
     */
    async updateCondition(competencyId: string, conditionUpdate: Partial<Condition>) {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .patch(
            COMPETENCY_ROUTES.UPDATE_CONDITION(competencyId),
            conditionUpdate,
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
            throw e;
        });
    }

    /**
     * Method to send degree updates
     *
     * @param competencyId current competency being edited
     * @param degreeUpdate updated fields of a degree attribute
     * @returns null for successful request
     */
    async updateDegree(competencyId: string, degreeUpdate: Partial<Degree>) {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .patch(
            COMPETENCY_ROUTES.UPDATE_DEGREE(competencyId),
            degreeUpdate,
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
            throw e;
        });
    }

    /**
     * Method to send employability updates
     *
     * @param competencyId current competency being edited
     * @param employabilityUpdate updated fields of a employability attribute
     * @returns null for successful request
     */
    async updateEmployability(competencyId: string, employabilityUpdate: Partial<Employability>) {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .patch(
            COMPETENCY_ROUTES.UPDATE_EMPLOYABILITY(competencyId),
            employabilityUpdate,
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
            throw e;
        });
    }

    /**
     * Method to send notes updates
     *
     * @param competencyId current competency being edited
     * @param notesUpdate updated fields of notes attribute
     * @returns null for successful request
     */
    async updateNotes(competencyId: string, notesUpdate: Partial<Notes>) {
        this.auth.initHeaders();
        return await lastValueFrom(this.http
        .patch(
            COMPETENCY_ROUTES.UPDATE_NOTES(competencyId),
            notesUpdate,
            { headers: this.auth.headers, withCredentials: true, responseType: 'json' }
        ))
        .catch((e)=> {
            this.snackBarService.sendNotificationByError(e);
            throw e;
        });
    }
}
