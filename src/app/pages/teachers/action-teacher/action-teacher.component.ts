import { Component, Input, OnInit } from '@angular/core';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableActions } from '../../../_shared/table/TableActions';
import { TestService, UserService } from '@services';
import { CsInputDirective } from '../../../_core/directives/cs-input.directive';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-action-teacher',
  standalone: true,
  imports: [
    BtnColorDirective,
    MatDialogClose,
    ReactiveFormsModule,
    CsInputDirective,
    MatProgressBar,
    NgIf
  ],
  templateUrl: './action-teacher.component.html',
  styleUrl: './action-teacher.component.scss'
})
export class ActionTeacherComponent implements OnInit {
  @Input() dialogData: any;

  formGroup: FormGroup;
  formGroupTeacher: FormGroup;
  loadProcess: boolean = false;

  constructor(
          private dialogRef: MatDialogRef<ActionTeacherComponent>,
          private teacherService: TestService,
          private userService: UserService,
  ) { }

  ngOnInit(): void {
    const { action, item } = this.dialogData;

    this.formGroup = new FormGroup({
      email: new FormControl('', [ Validators.required ]),
      name: new FormControl('', [ Validators.required ]),
      role_id: new FormControl(2, [ Validators.required ]),
    });

    this.formGroupTeacher = new FormGroup({
      curp: new FormControl('', [Validators.required]),
      ine: new FormControl('', [Validators.required]),
      cedula: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required])
    });

    if (action === TableActions.edit) {
      this.formGroup.patchValue(item);
      this.formGroupTeacher.patchValue(item.teacher);
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid && this.formGroupTeacher.invalid) {
      return;
    }

    this.loadProcess = true;

    if (this.dialogData.action === TableActions.add) {
      return this.add(this.formGroup.value);
    }

    const { id } = this.dialogData.item;

    const params = {
      ...this.formGroup.value,
      ...this.formGroupTeacher.value,
    };
    this.update(id, params);
  }

  private add(params): void {
    const teacherValue = this.formGroupTeacher.value;
    params['password'] = '123456';
    const paramsAll = {
      users: params,
      teacherForm: {
        first_name: params.name,
        ...teacherValue
      },
    };

    this.userService.createUser(paramsAll).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogRef.close(response);
        }
      },
      complete: () => {  this.loadProcess = false; },
      error: () => {
        this.loadProcess = false;
      }
    });
  }

  private update(id, params): void {
    this.teacherService.testUpdate(id, params).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogRef.close(response);
        }
      }, error: () => {
        this.loadProcess = false;
      }, complete: () => {}
    });
  }
}
