import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '@services';

export const authGuard: CanActivateFn = (): boolean => {
    const sessionStorage: LocalStorageService = inject(LocalStorageService);


    const router: Router = inject(Router);

    const access = sessionStorage.getToken();

    if (access !== null) {
        return true;
    }

    router.navigate([ '/auth' ]);

    return false;
};

