import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPasswordService } from '@services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  formGroup: FormGroup;
  messageText : string = null;
  loadProcess: boolean = false;

  constructor(
          private forgotPasswordService : ForgotPasswordService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.email ]),
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.loadProcess = true;
    this.forgotPasswordService.sendMail(this.formGroup.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.messageText = response.message;
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

}
