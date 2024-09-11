import { EMPTY, finalize } from 'rxjs';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from '@services';
import { inject } from '@angular/core';
import { LoaderService } from '../directives/loader/loader.service';
import { Router } from '@angular/router';

const allowedWithoutToken = [
    [ 'POST', /api\/login$/ ],
    [ 'POST', /api\/register$/ ],
];

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService: LoaderService = inject(LoaderService);
    const sessionStorage: LocalStorageService = inject(LocalStorageService);

    if (isAllowedUrl(req)) {
        return next(req).pipe(
                finalize((): void => {
                    loaderService.removeCounter();
                }));
    }

    if (req.url.match(/api\//)) { // api call

        let authToken: string = sessionStorage.getToken();

        if (authToken !== null && authToken !== undefined) {
            let authHeader: string = 'Bearer ' + authToken;
            loaderService.addCounter();
            const authReq: HttpRequest<any> = req.clone({
                setHeaders: {
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'instanceName': ''
                }
            });

            return next(authReq).pipe(
                    finalize((): void => {
                        loaderService.removeCounter();
                    })
            );
        } else {
            handleUnauthorized();
            return EMPTY;
        }
    }

    return EMPTY;
};

function handleUnauthorized(): void {
    const router: Router = inject(Router);
    const sessionStorage: LocalStorageService = inject(LocalStorageService);

    sessionStorage.clearSessionStorage();
    router.navigate([ '/auth' ]);
}

function isAllowedUrl(req: HttpRequest<any>): boolean {
    return allowedWithoutToken.some(([ method, url ]) =>
            req.method === method && req.url.match(url)
    );
}
