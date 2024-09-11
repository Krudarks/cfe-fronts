import { Component, Input, OnInit } from '@angular/core';
import { BtnColorDirective } from '../../../../_core/directives/btn-color.directive';
import { CsInputDirective } from '../../../../_core/directives/cs-input.directive';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseModuleService } from '@services';
import { TableActions } from '../../../../_shared/table/TableActions';

@Component({
  selector: 'app-action-module',
  standalone: true,
    imports: [
        BtnColorDirective,
        CsInputDirective,
        MatDialogClose,
        ReactiveFormsModule
    ],
  templateUrl: './action-module.component.html',
  styleUrl: './action-module.component.scss'
})
export class ActionModuleComponent implements OnInit{
    @Input() dialogData: any;

    formGroup: FormGroup;
    loadProcess: boolean = false;

    constructor(
            private dialogRef: MatDialogRef<ActionModuleComponent>,
            private moduleService: CourseModuleService,
    ) { }

    ngOnInit(): void {
        const { action, item, course } = this.dialogData;

        this.formGroup = new FormGroup({
            name: new FormControl('', [ Validators.required ]),
            description: new FormControl('', [ Validators.required ]),
            group_id: new FormControl('', [ Validators.required ]),
        });

        this.formGroup.get('group_id').setValue(course.id);

        if (action === TableActions.edit) {
            this.formGroup.patchValue(item);
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
        this.moduleService.create(params).subscribe({
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
        this.moduleService.update(id, params).subscribe({
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
}

