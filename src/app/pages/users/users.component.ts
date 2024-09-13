import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass, NgIf } from '@angular/common';
import { FilterPipe } from '../../_core/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ActionUserComponent } from './action-user/action-user.component';
import { TableActions } from '../../_shared/table/TableActions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Utils } from '../../_core/utils/Utils';
import { DialogService } from '../../_shared/modal/dialog.service';
import { Modal } from '../../_core/utils/Modal';
import { UserService } from '@services';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AlertBannerComponent } from '../../_shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTooltip,
    NgClass,
    FilterPipe,
    FormsModule,
    BtnColorDirective,
    MatMenu,
    MatMenuTrigger,
    MatProgressBar,
    NgIf,
    AlertBannerComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;

  usersSystem: any[] = [];
  selectItem: any;
  searchText: string;
  viewTable: boolean = true;
  actions = TableActions;
  loadProcess: boolean = false;

  constructor(
          private dialogService: DialogService,
          private userService: UserService,
          public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProcess = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.usersSystem = data;
      },
      complete: () => { this.loadProcess =false;},
      error: () => { this.loadProcess =false;}
    });
  }

  changeView(type: string): void {
    this.viewTable = type === 'table';
  }

  setItem(item): void {
    this.selectItem = item;
  }

  actionUser(action: string): void {
    if (action === TableActions.edit && this.selectItem === undefined) return;
    const title: string = action === TableActions.add ? 'Nuevo Usuario': 'Editar Usuario ' + this.selectItem.name;

    const config: MatDialogConfig<any> = {
      width: '50%',
      
      data: {
        title: title,
        dialogData: {
          action: action,
          item: this.selectItem
        }
      }
    };

    const dialogRef = this.dialogService.open(ActionUserComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        if (result.status) {
          if (action === this.actions.add) {
            this.usersSystem.push(result.data);
            this.alertBannerComponent.setMessage('Trabajador Agregado con Éxito', 'success');
          } else {
            const index = this.usersSystem.findIndex(teacher => teacher.id === result.data.user.id);
            if (index !== -1) {
              this.selectItem.name = result.data.name;
              this.usersSystem[index] = this.selectItem;
              this.alertBannerComponent.setMessage('Trabajador Actualizado con Éxito', 'success');
            }
          }
        }
      }
    });
  }

  deleteItem(): void {
    const item = this.selectItem;
    Modal.confirmationDialog(this.dialog, {
      title: '¿Estás seguro?',
      message: 'Esto realizará una acción irreversible.',
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadProcess = true;
        this.userService.delete(item.id).subscribe({
          next: (response) => {
            if (response.status) {
              const index = this.usersSystem.findIndex(student => student.id === item.id);
              if (index !== -1) {
                this.usersSystem.splice(index, 1);
              }
            }
          },
          complete: () => {this.loadProcess = false; },
          error: () => { this.loadProcess = false; }
        });
      }
    });
  }

}
