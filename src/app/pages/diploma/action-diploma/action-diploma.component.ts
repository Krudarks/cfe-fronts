import { Component, Input, OnInit } from '@angular/core';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableActions } from '../../../_shared/table/TableActions';
import { DiplomaService } from '@services';
import { CsInputDirective } from '../../../_core/directives/cs-input.directive';

@Component({
  selector: 'app-action-group',
  standalone: true,
    imports: [
        BtnColorDirective,
        MatDialogClose,
        CsInputDirective,
        ReactiveFormsModule
    ],
  templateUrl: './action-diploma.component.html',
  styleUrl: './action-diploma.component.scss'
})
export class ActionDiplomaComponent implements OnInit {
    @Input() dialogData: any;

    formGroup: FormGroup;
    loadProcess: boolean = false;

    constructor(
            private dialogRef: MatDialogRef<ActionDiplomaComponent>,
            private groupService: DiplomaService,
    ) { }

    ngOnInit(): void {
        const { action, item } = this.dialogData;

        this.formGroup = new FormGroup({
            name: new FormControl('', [ Validators.required ]),
            description: new FormControl('', [ Validators.required ]),
        });

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
        this.groupService.create(params).subscribe({
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
        this.groupService.update(id, params).subscribe({
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
