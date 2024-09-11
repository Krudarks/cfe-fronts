import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { Chart } from './chart.mockup';
import { NotesService, UserService } from '@services';
import { Modal } from '../../_core/utils/Modal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TableActions } from '../../_shared/table/TableActions';
import { Utils } from '../../_core/utils/Utils';
import { DialogService } from '../../_shared/modal/dialog.service';
import { ActionNoteComponent } from './action-note/action-note.component';
import { DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    DatePipe,
    MatTooltip
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  protected readonly actions = TableActions;
  lastStudents: any[] = [];
  notes: any[] = [];
  loadProcess: boolean = false;

  constructor(private notesService: NotesService,
          private userService: UserService,
          public dialog: MatDialog,
          private dialogService: DialogService,
          ) {}

  ngOnInit(): void {
    if (document.getElementById('column-chart') && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById('column-chart'), Chart);
      chart.render();
    }

    this.notesService.getAll().subscribe({
      next: (response) => {
        this.notes = response;
      },
    });

    this.userService.getLasted().subscribe({
      next: (response) => {
        this.lastStudents = response;
      },
    });
  }


  deleteNote(item): void {
    Modal.confirmationDialog(this.dialog, {
      title: '¿Estás seguro?',
      message: 'Esto realizará una acción irreversible.',
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadProcess = true;
        this.notesService.delete(item.id).subscribe({
          next: (response) => {
            if (response.status) {
              const index = this.notes.findIndex(student => student.id === item.id);
              if (index !== -1) {
                this.notes.splice(index, 1);
              }
            }
          },
          complete: () => {this.loadProcess = false; },
          error: () => { this.loadProcess = false; }
        });
      }
    });
  }

  actionNote(action: string): void {
    const config: MatDialogConfig<any> = {
      width: '50%',
      data: {
        title: 'Nueva Nota',
        dialogData: {
          action: action,
          item: ''
        }
      }
    };

    const dialogRef = this.dialogService.open(ActionNoteComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        if (result.status) {
          if (action === this.actions.add) {
            this.notes.push(result.data);
          } else {

          }
        }
      }
    });
  }

}
