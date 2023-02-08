import { HttpErrorResponse } from '@angular/common/http';

export class GraphErrorHandler {
    constructor() {

    }

    /**
     * parses an error from graphql and returns the last error
     *
     * @param err the error response from graphql
     * @returns the last parsed to match snackbar service
     */
    static handleError(err: HttpErrorResponse): Object | undefined {
        const res: Object[] = [];
        if (err.error.hasOwnProperty('errors')) {
            const errorsLength = err.error.errors.length;
            for (let i = 0; i < errorsLength; i++) {
                // append each error
                const error = {'status': err.status, 'error': {'message':err.error.errors[i].message}};
                res.push(error);
            }
        } else {
            const error = {'status': err.status, 'error': {'message':err.error.message}};
            res.push(error);
        }

        return res.pop();
    }
}
