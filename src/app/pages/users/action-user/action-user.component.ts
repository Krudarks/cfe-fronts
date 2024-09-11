import { Component, Input, OnInit } from '@angular/core';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableActions } from '../../../_shared/table/TableActions';
import { ForgotPasswordService, UserService } from '@services';
import { CsInputDirective } from '../../../_core/directives/cs-input.directive';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { NEW_USER_NOTIFICATION } from '../../../_core/constants/NotificationAction.constants';

const password_base = '123456';

@Component({
  selector: 'app-action-user',
  standalone: true,
  imports: [
    BtnColorDirective,
    MatDialogClose,
    ReactiveFormsModule,
    CsInputDirective,
    MatProgressBar,
    NgIf
  ],
  templateUrl: './action-user.component.html',
  styleUrl: './action-user.component.scss'
})
export class ActionUserComponent implements OnInit {
  @Input() dialogData: any;

  formGroup: FormGroup;
  loadProcess: boolean = false;

  constructor(
          private dialogRef: MatDialogRef<ActionUserComponent>,
          private userService: UserService,
          private passwordService: ForgotPasswordService,
  ) { }

  ngOnInit(): void {
    const { action, item } = this.dialogData;

    this.formGroup = new FormGroup({
      email: new FormControl('', [ Validators.required ]),
      name: new FormControl('', [ Validators.required ]),
      role_id: new FormControl('', [ Validators.required ]),
    });

    if (action === TableActions.edit) {
      this.formGroup.patchValue(item);
      this.formGroup.get('email').disable();
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.loadProcess = true;

    if (this.dialogData.action === TableActions.add) {
      return this.add(this.formGroup.value);
    }

    const { id } = this.dialogData.item;

    this.update(id, this.formGroup.value);
  }

  private add(params): void {
    params['password'] = password_base;
    const paramsAll = {
      users: params,
      testForm: {
        first_name: ''
      },
      workerForm: { first_name: '', last_name: '', phone: '', }
    };

    const newUser = { 'email': params.email, 'newUser': NEW_USER_NOTIFICATION };
    this.userService.createUser(paramsAll).subscribe({
      next: (response) => {
        if (response.status) {
          this.passwordService.sendMail(newUser).subscribe(() => {});
          this.dialogRef.close(response);
        }
      },
      complete: () => { this.loadProcess = false; },
      error: () => {
        this.loadProcess = false;
      }
    });
  }

  private update(id, params): void {
    this.userService.update(id, params).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogRef.close(response);
        }
      },
      complete: () => { this.loadProcess = false; },
      error: () => {
        this.loadProcess = false;
      }
    });
  }
}
