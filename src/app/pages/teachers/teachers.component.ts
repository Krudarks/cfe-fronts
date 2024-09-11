import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FilterPipe } from '../../_core/pipes/filter.pipe';
import { Test } from './tests.mockup';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';
import { TableActions } from '../../_shared/table/TableActions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Utils } from '../../_core/utils/Utils';
import { Modal } from '../../_core/utils/Modal';
import { ActionTeacherComponent } from './action-teacher/action-teacher.component';
import { DialogService } from '../../_shared/modal/dialog.service';
import { ViewStudentsComponent } from './view-students/view-students.component';
import { TestService, UserService } from '@services';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    NgClass,
    FilterPipe,
    FormsModule,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    NgForOf,
    MatMenuTrigger,
    BtnColorDirective,
    MatProgressBar,
    NgIf
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent implements OnInit {
  tests: Test[] = [];
  searchText: string;
  viewTable: boolean = true;

  selectItem: any;
  actions = TableActions;
  loadProcess: boolean = false;

  constructor(
          private dialogService: DialogService,
          private teacherService: TestService,
          private userService: UserService,
          public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.tests = data;
      },
      complete: () => { },
      error: () => { }
    });
  }

  setItem(item): void {
    this.selectItem = item;
  }

  changeView(type: string): void {
    this.viewTable = type === 'table';
  }

  actionTeacher(action: string): void {
    if (action === TableActions.edit && this.selectItem === undefined) return;

    const title: string = action === TableActions.add ? 'Nuevo Test':'Editar Test ' + this.selectItem.name;

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

    const dialogRef = this.dialogService.open(ActionTeacherComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        if (result.status) {
          if (action === this.actions.add) {
            this.tests.push(result.data);
          } else { // edit
            const index = this.tests.findIndex(test => test.id === result.data.user.id);
            if (index !== -1) {
              this.selectItem.teacher = result.data.teacher;
              this.selectItem.name = result.data.user.name;
              this.tests[index] = this.selectItem;
            }
          }
        }
      }
    });
  }

  viewStudents(): void {
    const config: MatDialogConfig<any> = {
      width: '50%',

      data: {
        title: 'Ver Trabajadores',
        dialogData: {
          action: 'view-users',
          item: this.selectItem
        }
      }
    };

    this.dialogService.open(ViewStudentsComponent, config);
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
              const index = this.tests.findIndex(worker => worker.id === item.id);
              if (index !== -1) {
                this.tests.splice(index, 1);
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
