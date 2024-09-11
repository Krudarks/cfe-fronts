import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '@services';

export const testGuard: CanActivateFn = (): boolean => {
    const sessionStorage: LocalStorageService = inject(LocalStorageService);
    const router: Router = inject(Router);

    if (sessionStorage.isTest) {
        return true;
    }

    router.navigate([ '/layout' ]);

    return false;
};

