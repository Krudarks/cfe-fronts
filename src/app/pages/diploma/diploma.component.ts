import { Component, ViewChild } from '@angular/core';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';
import { FilterPipe } from '../../_core/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgClass, NgIf } from '@angular/common';
import { TableActions } from '../../_shared/table/TableActions';
import { DialogService } from '../../_shared/modal/dialog.service';
import { DiplomaService, LocalStorageService } from '@services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Utils } from '../../_core/utils/Utils';
import { Modal } from '../../_core/utils/Modal';
import { Router } from '@angular/router';
import { ActionDiplomaComponent } from './action-diploma/action-diploma.component';
import { AlertBannerComponent } from '../../_shared/alert-banner/alert-banner.component';

@Component({
    selector: 'app-diploma',
    standalone: true,
    imports: [
        BtnColorDirective,
        FilterPipe,
        FormsModule,
        MatMenu,
        MatProgressBar,
        NgIf,
        NgClass,
        MatMenuTrigger,
        AlertBannerComponent
    ],
    templateUrl: './diploma.component.html',
    styleUrl: './diploma.component.scss'
})
export class DiplomaComponent {
    @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;

    groups: any[] = [];
    searchText: string;
    viewTable: boolean = true;

    selectItem: any;
    actions = TableActions;
    loadProcess: boolean = false;
    isAdmin: boolean = false;

    constructor(
            private dialogService: DialogService,
            private DiplomaService: DiplomaService,
            public dialog: MatDialog,
            private localStorageService: LocalStorageService, private router: Router
    ) { }

    ngOnInit(): void {
        if (this.localStorageService.isAdmin) {
            this.isAdmin = true;
        }

        this.getDiploma();
    }

    private getDiploma(): void {
        this.loadProcess = true;
        this.DiplomaService.getAll().subscribe({
            next: (data) => {
                this.groups = data;
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

    actionDiploma(action: string): void {
        if (action === TableActions.edit && this.selectItem === undefined) return;
        const title: string = action === TableActions.add ? 'Nuevo Diplomado':'Editar Diplomado ' + this.selectItem.nombre;

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

        const dialogRef = this.dialogService.open(ActionDiplomaComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (Utils.isObject(result)) {
                if (result.status) {
                    if (action === this.actions.add) {
                        this.groups.push(result.data);
                        this.alertBannerComponent.setMessage('Diplomado Agregado con Exito', 'success');
                        return;
                    }

                    const { name, description, id } = result.data;
                    const index = this.groups.findIndex(teacher => teacher.id === id);
                    if (index !== -1) {
                        this.selectItem.name = name;
                        this.selectItem.description = description;
                        this.groups[index] = this.selectItem;

                        this.alertBannerComponent.setMessage('Diplomado Actualizado con Exito', 'success');
                    }
                }
            }
        });
    }

    actionGroups(): void {
        const item = this.selectItem;
        if (item === undefined) {
            return;
        }

        // Asumiendo que item tiene una propiedad id
        const itemId = item.id;
        this.router.navigate([ `layout/diploma/groups/`, itemId ]);
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
                this.DiplomaService.delete(item.id).subscribe({
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

}
