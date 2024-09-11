import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '@services';
import { AuthService } from '../../_core/auth/auth.service';
import { AlertBannerComponent } from '../../_shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, MaterialModule, ReactiveFormsModule, RouterLink, AlertBannerComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;

  formGroup: FormGroup;
  loadProcess: boolean = false;

  constructor(
          private router: Router,
          private authService: AuthService,
          private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', [ Validators.required ]), // , Validators.email
      password: new FormControl('', [ Validators.required ]),
      remember: new FormControl(false),
    });

    if (localStorage.getItem('email') !== null) {
      this.formGroup.get('email').setValue(localStorage.getItem('email'));
      this.formGroup.get('password').setValue(localStorage.getItem('password'));
      this.formGroup.get('remember').setValue(true);
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.loadProcess = true;
    this.authService.login(this.formGroup.value).subscribe({
      next: (response) => {
        if (response.status) {
          this.remember(this.formGroup.value);
          this.localStorage.storeToken(response.token);
          this.localStorage.setSessionStorage('user', response.user);
          this.router.navigate([ '/layout' ]);
        } else {
          this.alertBannerComponent.setMessage('Error: Credenciales no válidas.', 'error')
        }
      },
      error: () => {
        this.loadProcess = false;
        this.alertBannerComponent.setMessage('Error: Algo ha ido mal. Vuelva a intentarlo.', 'error');
      },
      complete: () => { this.loadProcess = false; },
    });
  }

  remember(credentials): void {
    if (credentials.remember) {
      localStorage.setItem('email', credentials.email);
      localStorage.setItem('password', credentials.password);
      return;
    }

    sessionStorage.setItem('email', credentials.email);
    sessionStorage.setItem('password', credentials.password);
  }

}
