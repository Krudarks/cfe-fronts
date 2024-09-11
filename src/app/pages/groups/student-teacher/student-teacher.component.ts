import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { FilterPipe } from '../../../_core/pipes/filter.pipe';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgClass, NgIf } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableActions } from '../../../_shared/table/TableActions';
import { GroupService } from '@services';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Modal } from '../../../_core/utils/Modal';
import { STUDENT } from '../../../_core/constants/Roles.constants';

@Component({
    selector: 'app-student-teacher',
    standalone: true,
    imports: [
        BtnColorDirective,
        FilterPipe,
        MatDialogClose,
        MatMenu,
        MatProgressBar,
        NgIf,
        ReactiveFormsModule,
        MatMenuTrigger,
        NgClass,
        FormsModule,
        MatTableModule,
        MatTabGroup,
        MatTab
    ],
    templateUrl: './student-teacher.component.html',
    styleUrl: './student-teacher.component.scss'
})
export class StudentTeacherComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup;
    @Input() dialogData: any;

    users: any[] = [];
    freeUsers: any[] = [];
    searchText: string;
    viewTable: boolean = true;
    actions = TableActions;
    selectItem: any;

    formGroup: FormGroup;
    loadProcess: boolean = false;
    isStudentModule: boolean = true;
    fieldEmpty: string = 'Sin Estudiantes para Mostrar';

    constructor(
            private groupService: GroupService,
            public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        const { action, item } = this.dialogData;

        if (action === STUDENT) {
            return this.getStudent(item);
        }

        this.isStudentModule = false;
        this.fieldEmpty = 'Sin Maestros para Mostrar';

        return this.getTeacher(item);
    }

    private getStudent(item): void {
        this.loadProcess = true;
        this.groupService.getStudents(item.id).subscribe({
            next: (data) => {
                this.users = data.users;
                this.freeUsers = data.freeUsers;
            },
            complete: () => { this.loadProcess = false; },
            error: () => { this.loadProcess = false; }
        });
    }

    private getTeacher(item): void {
        this.loadProcess = true;
        this.groupService.getTeachers(item.id).subscribe({
            next: (data) => {
                this.users = data.users;
                this.freeUsers = data.freeUsers;
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
        const message = this.isStudentModule ? 'Enlazar Estudiante Al Grupo':'Enlazar Maestro Al Grupo';
        const message_ = this.isStudentModule ? 'Desenlazar Estudiante Al Grupo':'Desenlazar Maestro Al Grupo';

        Modal.confirmationDialog(this.dialog, {
            title: '¿Estás seguro?',
            message: action === this.actions.add ? message:message_,
        }).afterClosed().subscribe((result: boolean) => {
            if (result) {
                const params = {
                    group_id: this.dialogData.item.id,
                    user_id: this.selectItem.id,
                };

                if (action === this.actions.add) {
                    return this.linkUser(params);
                }

                return this.unLinkUser(params);
            }
        });
    }

    private linkUser(params): void {
        this.loadProcess = true;
        this.groupService.linkUser(params).subscribe({
            next: (data) => {
                if (data.status) {
                    this.users.push(data.data);
                    this.freeUsers = this.freeUsers.filter(val => val.id !== params.user_id);
                    this.tabGroup.selectedIndex = 0;
                }
            },
            complete: () => { this.loadProcess = false; },
            error: () => { this.loadProcess = false; }
        });
    }

    private unLinkUser(params): void {
        this.loadProcess = true;
        this.groupService.unLinkUser(params).subscribe({
            next: (data) => {
                if (data.status) {
                    this.users.push(this.selectItem);
                    this.freeUsers = this.freeUsers.filter(val => val.id !== params.user_id);
                }
            },
            complete: () => { this.loadProcess = false; },
            error: () => { this.loadProcess = false; }
        });
    }

    changeView(type: string): void {
        this.viewTable = type === 'table';
    }

    changeIndex(): void {
        this.searchText = '';
    }
}
