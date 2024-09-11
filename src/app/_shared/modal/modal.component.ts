import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ComponentType } from '@angular/cdk/overlay';
import { RenderDirective } from './render.directive';

interface DataModal {
  title: string,
  icon: string,
  component: ComponentType<any>,
  dialogData?: any;
  hideTitle?: boolean;
  hideClose?: boolean;
}

const defaultDataModal: DataModal = {
  title: '',
  icon: '',
  component: null, // Reemplaza null con el valor por defecto que desees
  hideTitle: false,
  hideClose: false,
};

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatButtonModule, RenderDirective ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DataModal = defaultDataModal) {
  }
}
