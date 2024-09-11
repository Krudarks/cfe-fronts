import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from './modal.component';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public open(component: ComponentType<any>, dialogConfig: MatDialogConfig) {
    dialogConfig.data = { ...dialogConfig.data, component: component };
    return this.dialog.open(ModalComponent, dialogConfig);
  }
}
