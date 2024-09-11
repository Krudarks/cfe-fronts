import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ForgotPasswordService } from '@services';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  formGroup: FormGroup;
  loadProcess: boolean = false;

  constructor(
          private activatedRoute: ActivatedRoute,
          private forgotPasswordService: ForgotPasswordService,
          private router: Router
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      password: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
      password_confirmation: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    });
  }

  get token() {
    return this.activatedRoute.snapshot.paramMap.get('token');
  }

  get email() {
    return this.activatedRoute.snapshot.paramMap.get('email');
  }

  get form() {
    return this.formGroup.controls;
  }

  onSubmit(): void {
    if (!this.validatePasswords) {
      return;
    }

    const params = {
      ...this.formGroup.value,
      token: this.token,
      email: this.email
    };

    this.loadProcess = true;
    this.forgotPasswordService.resetPassword(params).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.router.navigate([ '/auth' ]);
        }

        this.loadProcess = false;
        this.formGroup.enable();
      },
      complete: () => {
        this.loadProcess = true;
      },
      error: () => {
        this.loadProcess = false;
      }
    });
  }

  get validatePasswords(): boolean {
    const password = this.formGroup.get('password');
    const password_confirmation = this.formGroup.get('password_confirmation');

    // Si el formulario es inválido
    if (this.formGroup.invalid) {
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
}
