import { Component, Input, OnInit } from '@angular/core';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { CsInputDirective } from '../../../_core/directives/cs-input.directive';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { NotesService } from '@services';
import { TableActions } from '../../../_shared/table/TableActions';

@Component({
  selector: 'app-action-note',
  standalone: true,
  imports: [
    BtnColorDirective,
    CsInputDirective,
    FormsModule,
    MatDialogClose,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './action-note.component.html',
  styleUrl: './action-note.component.scss'
})
export class ActionNoteComponent  implements OnInit{
  @Input() dialogData: any;

  formGroup: FormGroup;
  loadProcess: boolean = false;

  constructor(
          private dialogRef: MatDialogRef<ActionNoteComponent>,
          private notesService: NotesService,
  ) { }

  ngOnInit(): void {
    const { action, item } = this.dialogData;

    this.formGroup = new FormGroup({
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

  }

  private add(params): void {
    this.notesService.create(params).subscribe({
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
