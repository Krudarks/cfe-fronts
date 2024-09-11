import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPasswordService, LocalStorageService, LogoutService } from '@services';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule} from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: true,
  imports: [ CommonModule, MaterialModule, ReactiveFormsModule, BtnColorDirective ]
})
export class ChangePasswordComponent {
  @ViewChild('stepper') stepper: MatStepper;

  formGroup: FormGroup;
  validPassword: boolean = false;

  incorrectPassword: Boolean = false;
  disableButton: boolean = false;
  passwordMatch: boolean = false;

  newPasswordForm: FormGroup;
  showTimer: boolean = false;

  /** timer */
  timeLeft: number = 5;
  interval;

  constructor(
          private forgotPasswordService: ForgotPasswordService,
          private logoutService: LogoutService,
          private dialog: MatDialog,
          private localStorageService: LocalStorageService,
          private router: Router,
  ) {
    this.formGroup = new FormGroup({
      password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    });

    this.newPasswordForm = new FormGroup({
      password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
      password_confirmation: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    });
  }

  get form() {
    return this.formGroup.controls;
  }

  get formNewPassword() {
    return this.newPasswordForm.controls;
  }

  validateCurrentPassword(): void {
    const params = {
      password: this.formGroup.get('password').value
    };

    this.disableButton = true;
    this.forgotPasswordService.checkPassword(params).subscribe({
      next: (response) => {
        if (response.status) {
          this.validPassword = true;
          this.incorrectPassword = false;
          this.disableButton = false;
          this.stepper.next();
          return;
        }
        this.validPassword = false;
        this.incorrectPassword = true;
      },
      error: (err) => {
        this.disableButton = false;

        if (err.status === 300) {
          this.logout();
        }
      }
    });
  }

  logout(): void {
    this.logoutService.logout();
  }

  changePassword(): void {
    if (!this.validatePasswords) {
      return;
    }
    this.disableButton = true;
    this.forgotPasswordService.changePassword(this.newPasswordForm.value).subscribe({
      next: (response) => {
        if (response.status) {
          this.showSuccessMessage().then(() => {});
        }
      },
      error:()=>{
        this.disableButton = false;
      }
    });
  }

  get validatePasswords(): boolean {
    const password = this.newPasswordForm.get('password');
    const password_confirmation = this.newPasswordForm.get('password_confirmation');

    // Si el formulario es inválido
    if (this.newPasswordForm.invalid) {
      password.setErrors({ 'passwordMatch': false });
      password_confirmation.setErrors({ 'passwordMatch': false });
      return false;
    } else {
      // Si las contraseñas no coinciden
      if (password.value !== password_confirmation.value) {
        password.setErrors({ 'passwordMatch': false });
        password_confirmation.setErrors({ 'passwordMatch': false });
        return false;
      }
    }

    return true;
  }

  async showSuccessMessage(): Promise<any> {
    this.showTimer = true;
    this.disableButton = true;

    this.startTimer();

    await this.delay(5000);
    this.localStorageService.clearSessionStorage();
    this.dialog.closeAll();
    await this.router.navigate([ '/auth' ]);
  }

  private delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

}
