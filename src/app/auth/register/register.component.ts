import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CsInputDirective } from '../../_core/directives/cs-input.directive';
import { AuthService } from '../../_core/auth/auth.service';
import { AlertBannerComponent } from '../../_shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CsInputDirective,
    RouterLink,
    AlertBannerComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;
  formGroup: FormGroup;
  loadProcess: boolean = false;

  constructor(
          private forgotPasswordService: AuthService,
          private router: Router
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.email ]),
      first_name: new FormControl('', [ Validators.required ]),
      last_name: new FormControl('', [ Validators.required ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$') // Asegura que el número de teléfono sea de 10 dígitos
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }

  get form() {
    return this.formGroup.controls;
  }

  onSubmit(): void {
    if (!this.validatePasswords) {
      return;
    }

    const params = {
      users: {
        name: this.formGroup.get('first_name').value,
        email: this.formGroup.get('email').value,
        password: this.formGroup.get('password').value,
      },
      studentForm: {
        first_name: this.formGroup.get('first_name').value,
        last_name: this.formGroup.get('last_name').value,
        phone: this.formGroup.get('phone').value,
      }
    };

    this.loadProcess = true;
    this.forgotPasswordService.register(params).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.alertBannerComponent.setMessage('Sé ha dado de alta con éxito', 'success');
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
        this.alertBannerComponent.setMessage('Error: Algo ha ido mal. Vuelva a intentarlo.', 'error')
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
