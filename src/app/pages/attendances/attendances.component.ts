import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import { RouterLink} from "@angular/router";
import {AttendanceService} from "@services";

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
  attendanceReports: any[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.loadAttendances();
  }

  loadAttendances() {
    this.attendanceService.getAttendances().subscribe(
      (data) => {
        this.attendanceReports = data; // Ajusta esto según el formato de respuesta de tu API
      },
      (error) => {
        console.error('Error al cargar las asistencias:', error);
      }
    );
  }

  verReporte(reportId: number) {
    this.attendanceService.getAttendance(reportId).subscribe(
      (report) => {
        console.log('Ver reporte:', report);
      },
      (error) => {
        console.error('Error al cargar el reporte:', error);
      }
    );
  }

  descargarReporte(reportId: number) {
    // Lógica para descargar el reporte (esto puede requerir una API diferente para la generación de PDFs)
    console.log('Descargar reporte:', reportId);
  }

  editarReporte(reportId: number) {
    // Lógica para editar el reporte (esto puede implicar abrir un formulario con los datos)
    console.log('Editar reporte:', reportId);
  }
}
