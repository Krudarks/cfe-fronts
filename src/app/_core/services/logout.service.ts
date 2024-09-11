import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from './local-storage.service';
import { Modal } from '../utils/Modal';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
          private dialog: MatDialog,
          private authService: AuthService,
          private localStorageService: LocalStorageService,
          private router: Router,
  ) { }

  public execute(): void {
    Modal.confirmationLogout(this.dialog)
    .afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.localStorageService.clearSessionStorage();
        this.router.navigate([ '/auth' ]);
      }
    });
  }

  public logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        if (response.status) {
          this.localStorageService.clearSessionStorage();
          this.router.navigate([ '/auth' ]);
        }
      },
      error: (error) => {   console.error(error); }
    });
  }
}
