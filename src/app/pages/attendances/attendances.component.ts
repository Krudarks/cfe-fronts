import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AttendanceService } from '@services';
import { FilterPipe } from '../../_core/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { TableActions } from '../../_shared/table/TableActions';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    DatePipe,
    FilterPipe,
    FormsModule,
    MatMenu,
    MatMenuTrigger
  ],
  templateUrl: './attendances.component.html',
  styleUrl: './attendances.component.scss'
})
export class AttendancesComponent implements OnInit {
  attendances: any[] = [];
  searchText: string;
  selectItem: any;

  constructor(
    private attendanceService: AttendanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAttendances();
  }

  setItem(item): void {
    this.selectItem = item;
  }

  loadAttendances(): void {
    this.attendanceService.getAllAttendances().subscribe({
      next: data => {
        if (data.status) {
          this.attendances = data.data;
          return
        }
        this.attendances = [];
      }
    });
  }

  viewDetails(): void {
    if (this.selectItem === undefined) return;

    const { date } = this.selectItem;
    this.router.navigate(['/layout/attendance', date]);
  }

  downloadReport(): void {
    if (this.selectItem === undefined) return;

    const { id } = this.selectItem;

    this.attendanceService.downloadReport(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${ id }.pdf`;
      a.click();
    });
  }

  deleteRecord(): void {
    if (this.selectItem === undefined) return;

    const { id } = this.selectItem;
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      this.attendanceService.deleteAttendance(id).subscribe(() => {
        this.loadAttendances();
      });
    }
  }

  editRecord(): void {

    // Implementar lógica para editar el registro
  }

  protected readonly actions = TableActions;
}
