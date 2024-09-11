import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TableActions } from '../../../_shared/table/TableActions';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../_shared/modal/dialog.service';
import { MatDialog, MatDialogClose, MatDialogConfig } from '@angular/material/dialog';
import { CourseModuleService, LocalStorageService } from '@services';
import { Utils } from '../../../_core/utils/Utils';
import { ActionModuleComponent } from './action-module/action-module.component';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { FilterPipe } from '../../../_core/pipes/filter.pipe';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgClass, NgIf } from '@angular/common';
import { Modal } from '../../../_core/utils/Modal';
import { ADMIN } from '../../../_core/constants/Roles.constants';
import { AlertBannerComponent } from '../../../_shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-view-module',
  standalone: true,
  imports: [
    BtnColorDirective,
    FilterPipe,
    MatDialogClose,
    MatMenu,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    MatMenuTrigger,
    AlertBannerComponent
  ],
  templateUrl: './module.component.html',
  styleUrl: './module.component.scss'
})
export class ModuleComponent implements OnInit {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;
  modules: any[] = [];
  searchText: string;
  viewTable: boolean = true;
  actions = TableActions;
  selectItem: any;

  @Input() dialogData: any;

  formGroup: FormGroup;
  loadProcess: boolean = false;
  isAdmin: boolean = false;

  constructor(
          private dialogService: DialogService,
          private courseModuleService: CourseModuleService,
          public dialog: MatDialog,
          private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    if (this.localStorageService.getUserData.role.code === ADMIN) {
      this.isAdmin = true;
    }

    const { item } = this.dialogData;

    this.loadProcess = true;
    this.courseModuleService.getByGroup(item.id).subscribe({
      next: (data) => {
        this.modules = data;
      },
      complete: () => { this.loadProcess = false; },
      error: () => { this.loadProcess = false; }
    });
  }

  setItem(item): void {
    this.selectItem = item;
  }

  actionModule(action: string): void {
    if (action === TableActions.edit && this.selectItem === undefined) return;
    const title: string = action === TableActions.add ? 'Nuevo Modulo':'Editar Modulo ' + this.selectItem.nombre;

    const config: MatDialogConfig<any> = {
      width: '50%',

      data: {
        title: title,
        dialogData: {
          action: action,
          item: this.selectItem,
          course: this.dialogData.item
        }
      }
    };

    const dialogRef = this.dialogService.open(ActionModuleComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        if (result.status) {
          if (action === this.actions.add) {
            this.modules.push(result.data);
            this.alertBannerComponent.setMessage('Modulo Agregado con Exito', 'success');
            return;
          }

          const { name, description, id } = result.data;
          const index = this.modules.findIndex(teacher => teacher.id === id);
          if (index !== -1) {
            this.selectItem.name = name;
            this.selectItem.description = description;
            this.modules[index] = this.selectItem;

            this.alertBannerComponent.setMessage('Modulo Actualizado con Exito', 'success');
          }
        }
      }
    });
  }

  deleteItem(): void {
    const item = this.selectItem;
    if (item === undefined) {
      return;
    }
    Modal.confirmationDialog(this.dialog, {
      title: '¿Estás seguro?',
      message: 'Esto realizará una acción irreversible.',
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadProcess = true;
        this.courseModuleService.delete(item.id).subscribe({
          next: (response) => {
            if (response.status) {
              const index = this.modules.findIndex(student => student.id === item.id);
              if (index !== -1) {
                this.modules.splice(index, 1);
                this.selectItem = null;
              }
            }
          },
          complete: () => { this.loadProcess = false; },
          error: () => { this.loadProcess = false; }
        });
      }
    });
  }

  changeView(type: string): void {
    this.viewTable = type === 'table';
  }
}
