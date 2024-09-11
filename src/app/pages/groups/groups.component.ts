import { Component, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FilterPipe } from '../../_core/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { TableActions } from '../../_shared/table/TableActions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Utils } from '../../_core/utils/Utils';
import { Modal } from '../../_core/utils/Modal';
import { DialogService } from '../../_shared/modal/dialog.service';
import { ActionGroupComponent } from './action-group/action-group.component';
import { GroupService, LocalStorageService } from '@services';
import { MatProgressBar } from '@angular/material/progress-bar';
import { StudentTeacherComponent } from './student-teacher/student-teacher.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleComponent } from './module/module.component';
import { MatAnchor } from '@angular/material/button';
import { WORKER } from '../../_core/constants/Roles.constants';
import { AlertBannerComponent } from '../../_shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    NgClass,
    FilterPipe,
    FormsModule,
    BtnColorDirective,
    MatMenu,
    MatMenuTrigger,
    MatProgressBar,
    NgIf,
    MatAnchor,
    AlertBannerComponent
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;

  groups: any[] = [];
  searchText: string;
  viewTable: boolean = true;

  selectItem: any;
  actions = TableActions;
  loadProcess: boolean = false;
  isAdmin: boolean = false;
  id: number; // id del diplomado

  constructor(
          private dialogService: DialogService,
          private groupService: GroupService,
          public dialog: MatDialog,
          private localStorageService: LocalStorageService,
          private route: ActivatedRoute, private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
    });

    this.isAdmin = this.localStorageService.isAdmin;

    if (this.isAdmin || this.localStorageService.isTest) {
      this.viewAdmin();
      return;
    }

    this.viewUser();
  }

  private viewAdmin(): void {
    this.loadProcess = true;
    this.groupService.getByDiploma(this.id).subscribe({
      next: (data) => {
        if (data.status) {
          this.groups = data.data;
        }
      },
      complete: () => { this.loadProcess = false; },
      error: () => { this.loadProcess = false; }
    });
  }

  private viewUser(): void {
    this.loadProcess = true;
    this.groupService.byUser().subscribe({
      next: (data) => {
        this.groups = data.data;
      },
      complete: () => { this.loadProcess = false; },
      error: () => { this.loadProcess = false; }
    });
  }

  setItem(item): void {
    this.selectItem = item;
  }

  changeView(type: string): void {
    this.viewTable = type === 'table';
  }

  actionGroup(action: string): void {
    if (action === TableActions.edit && this.selectItem === undefined) return;
    const title: string = action === TableActions.add ? 'Nuevo Grupo':'Editar Grupo ' + this.selectItem.nombre;

    const config: MatDialogConfig<any> = {
      width: '50%',
      data: {
        title: title,
        dialogData: {
          action: action,
          item: this.selectItem,
          diploma_id: this.id
        }
      }
    };

    const dialogRef = this.dialogService.open(ActionGroupComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        if (result.status) {
          if (action === this.actions.add) {
            this.groups.push(result.data);
            this.alertBannerComponent.setMessage('Grupo Agregado con Exito', 'success');
            return;
          }

          const { name, description, id, limit } = result.data;
          const index = this.groups.findIndex(teacher => teacher.id === id);
          if (index !== -1) {
            this.selectItem.name = name;
            this.selectItem.description = description;
            this.selectItem.limit = limit;
            this.groups[index] = this.selectItem;

            this.alertBannerComponent.setMessage('Diplomado Actualizado con Exito', 'success');
          }

        }
      }
    });
  }

  actionCourse(): void {
    const item = this.selectItem;
    if (item === undefined) {
      return;
    }

    const config: MatDialogConfig<any> = {
      width: '50%',
      data: {
        title: 'Modulos del Grupo: ' + this.selectItem.name,
        dialogData: {
          action: 'view',
          item: this.selectItem
        }
      }
    };

    const dialogRef = this.dialogService.open(ModuleComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {

      }
    });
  }

  viewUsers(type): void {
    const message = type === WORKER ? 'Estudiantes':'Maestros';
    const config: MatDialogConfig<any> = {
      width: '50%',
      data: {
        title: 'Ver ' + message,
        dialogData: {
          action: type,
          item: this.selectItem
        }
      }
    };

    this.dialogService.open(StudentTeacherComponent, config);
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
        this.groupService.delete(item.id).subscribe({
          next: (response) => {
            if (response.status) {
              const index = this.groups.findIndex(student => student.id === item.id);
              if (index !== -1) {
                this.groups.splice(index, 1);
              }
            }
          },
          complete: () => { this.loadProcess = false; },
          error: () => { this.loadProcess = false; }
        });
      }
    });
  }

  backRoute(): void {
    this.router.navigate([ `layout/diploma` ]);
  }

}
