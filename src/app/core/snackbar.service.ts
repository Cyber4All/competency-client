import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SNACKBAR_COLOR } from '../shared/components/snackbar/snackbar.component';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class SnackbarService  {
    public notification$: Subject<{
        title: string,
        message: string,
        color: SNACKBAR_COLOR;
        callbacks?: { action: Function; display: string; style?: string }[];
    }> = new Subject();

    public sendNotificationByError(err: HttpErrorResponse){
        console.log(err);
        let title = 'ERROR';
        let message = 'Something went wrong on our end. Please try again later!';
        if (err.status !== 429){
            const apiError =   typeof err.error ===  'string' ? JSON.parse(err.error)  : err.error;
            message = apiError.message.charAt(0).toUpperCase()+apiError.message.substr(1);
        }
        console.log(err.status);

        switch (err.status){
            case 400:
            title = 'Invalid Input';
            break;
            case 401:
                title = 'Not logged in';
                message = 'Please log in to continue';
                break;
            case 403:
                title = 'Not Authorized';
                message = 'You are not authorized to access this resource';
                break;
            case 404:
                title = 'Not Found';
                break;
            case 409:
                title = 'Conflict';
                break;
            case 429:
                title = 'Too Many Requests';
                message = 'Too many request, please try again in 1 hour';
                break;
            default:
            title = 'Internal Service Error';
            message = 'Something went wrong on our end. Please  try again later.';
        }
        console.log(title,'after switch', message);
        this.notification$.next({
            title: title,
            message: message,
            color: SNACKBAR_COLOR.DANGER,
        });
    }

}
