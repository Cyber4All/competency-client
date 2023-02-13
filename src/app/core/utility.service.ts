import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { lastValueFrom } from "rxjs";
import { Downtime } from '../interfaces/Downtime';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    constructor(private http: HttpClient) {}

    async getDowntime(): Promise<Downtime> {
     // return await lastValueFrom(this.http.get<Downtime>(UTITLITY_ROUTES.GET_DOWNTIME()))
        return {'isDown': false, 'message': undefined};
    }
}
