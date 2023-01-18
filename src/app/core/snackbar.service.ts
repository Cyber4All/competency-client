import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { title } from 'process';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
    providedIn: 'root',
})
export class SnackbarService  {
    public notification$: Subject<{
        title: string,
        message: string,
        //color: SNACKBAR_COLOR;
        //callbacks
    }> = new Subject();

    sendNotificationByError(err: HttpErrorResponse){
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
                message = 'Too manyy request, please try again in 1 hour';
                break;
            default:
            title = 'Internal Service Error';
            message = 'Something went wrong on our end. Please  try again later.';
        }

        this.notification$.next({
            title: title,
            message: message,
            //color:
        });
    }

}
