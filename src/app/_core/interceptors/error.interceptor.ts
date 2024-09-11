import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(catchError(handleError));
};

function handleError(error: HttpErrorResponse) {
    const errorMessages: { [key: number]: string } = {
        400: 'Bad request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not found'
        // Agrega más mensajes de error según sea necesario
    };
    const errorStatus = errorMessages[error.status];
    if (error instanceof HttpErrorResponse && error.status === 401) {
        handleUnauthorized();
    }

    const errorMessage = errorStatus || `Server error: ${ error.message }`;
    return throwError(() => errorMessage);
}

function handleUnauthorized(): void {
    const sessionStorage: LocalStorageService = inject(LocalStorageService);
    const router: Router = inject(Router);

    sessionStorage.clearSessionStorage();
    router.navigate([ '/auth' ]);
}
