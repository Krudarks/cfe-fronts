import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { PaymentsTeacherService } from '../../../_core/services/payments-teacher.service';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { AlertBannerComponent } from '../../../_shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-add-enrollments',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    NgForOf,
    BtnColorDirective,
    MatDialogClose,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    AlertBannerComponent
  ],
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.scss'
})
export class AddPaymentComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('alertBanner') alertBanner: AlertBannerComponent;

  @Input() dialogData: any;
  loadProcess: boolean = false;
  teachersForm: FormGroup;
  groupsForm: FormGroup;
  mountForm: FormGroup;

  teachers: any[] = [];
  groups: any[] = [];
  errorMessage: string | null = null;

  constructor(
          private dialogRef: MatDialogRef<AddPaymentComponent>,
          private paymentsTeacherService: PaymentsTeacherService,
          private fb: FormBuilder
  ) {
    this.teachersForm = this.fb.group({
      firstCtrl: [ '', Validators.required ],
    });
    this.groupsForm = this.fb.group({
      secondCtrl: [ '', Validators.required ],
    });
    this.mountForm = this.fb.group({
      mount: [ '', [ Validators.required, this.decimalNumberValidator(2) ] ],
    });
  }

  ngOnInit(): void {
    this.paymentsTeacherService.wizardPayment().subscribe({
      next: (response) => {
        if (response.status) {
          this.teachers = response.teachers;
        }
      }
    });
  }

  decimalNumberValidator(maxDecimals: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No valida si el valor está vacío
      }

      const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`);
      return regex.test(control.value) ? null:{ 'decimalNumber': { value: control.value } };
    };
  }

  validateOne(): void {
    const control = this.teachersForm.get('firstCtrl');
    if (control?.invalid) {
      return;
    } else {
      this.groups = control.value.groups;
      if (this.groups.length) {
        this.stepper.next();
      }
    }
  }

  validateTwo(): void {
    const control = this.groupsForm.get('secondCtrl');
    if (control?.invalid) {
      return;
    } else {
      this.stepper.next();
    }
  }

  paymentUp(): void {
    const validate = [
      this.teachersForm.valid,
      this.groupsForm.valid,
      this.mountForm.valid,
    ];

    if (validate.every(isValid => isValid)) {
      this.loadProcess = true;
      const params = {
        teacher_id: this.teachersForm.get('firstCtrl')?.value['user_id'],
        group_id: this.groupsForm.get('secondCtrl')?.value['id'],
        mount: this.mountForm.get('mount')?.value
      };

      this.paymentsTeacherService.processPayment(params).subscribe({
        next: (response) => {
          if (response.status) {
            this.loadProcess = false;
            this.dialogRef.close(response);
            return this.alertBanner.setMessage(response.message, 'success');
          }

          this.alertBanner.setMessage(response.message, 'error');
        },
        error: () => {
          this.loadProcess = false;
          this.alertBanner.setMessage('Error al realizar el pago', 'error'
          );
        }
      });
    } else {
      this.alertBanner.setMessage(
              'Por favor, complete todos los formularios correctamente antes de proceder con el pago.',
              'error'
      );
    }
  }

}
