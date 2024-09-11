import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { DialogData } from '../../_core/utils/Modal';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';

@Component({
  selector: 'app-dialog-confirmation',
  standalone: true,
  imports: [
    MatDialogClose,
    BtnColorDirective,
  ],
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.scss'
})
export class DialogConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
  }
}
