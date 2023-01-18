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
        const title = 'ERROR';
        let message = 'Something went wrong on our end. Please try again later!';
        if (err.status !== 429){
            const apiError =   typeof err.error ===  'string' ? JSON.parse(err.error)  : err.error;
            message = apiError.message.charAt(0).toUpperCase()+apiError.message.substr(1);
        }
    }
}
