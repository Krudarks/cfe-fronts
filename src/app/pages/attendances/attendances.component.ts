import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AttendanceService } from '@services';

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    DatePipe
  ],
  templateUrl: './attendances.component.html',
  styleUrl: './attendances.component.scss'
})
export class AttendancesComponent implements OnInit {
  attendances: any[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAttendances();
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

  viewDetails(id: number): void {
    this.router.navigate(['/attendance', id]);
  }

  downloadReport(id: number, event: Event): void {
    event.stopPropagation();
    this.attendanceService.downloadReport(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${id}.pdf`;
      a.click();
    });
  }

  deleteRecord(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      this.attendanceService.deleteAttendance(id).subscribe(() => {
        this.loadAttendances();
      });
    }
  }

  editRecord(id: number, event: Event): void {
    event.stopPropagation();
    // Implementar lógica para editar el registro
  }
}
