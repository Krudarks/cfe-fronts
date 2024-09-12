import {Component, OnInit} from '@angular/core';
import {AttencarService} from "../../_core/services/attencar.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ActionVehicleComponent} from "./action-vehicle/action-vehicle.component";

@Component({
  selector: 'app-attendance-vehicles',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    ActionVehicleComponent
  ],
  templateUrl: './attendance-vehicles.component.html',
  styleUrl: './attendance-vehicles.component.scss'
})
export class AttendanceVehiclesComponent implements OnInit{
  reports: any[] = [];
  isModalOpen = false;

  constructor(private attencarService: AttencarService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    // Lógica para cargar los reportes
    // @ts-ignore
    this.attencarService.getReportById().subscribe((reports) => {
      this.reports = reports;
    });
  }

  openReportModal(): void {
    this.isModalOpen = true;
  }

  closeReportModal(): void {
    this.isModalOpen = false;
  }

  onReportSaved(): void {
    this.closeReportModal();
    this.loadReports(); // Recargar la lista después de guardar un nuevo reporte
  }

  viewReport(reportId: number): void {
    // Lógica para ver los detalles de un reporte
    console.log(`Ver reporte ${reportId}`);
  }

  deleteReport(reportId: number): void {
    // Lógica para eliminar un reporte
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.attencarService.deleteReport(reportId).subscribe(() => {
        this.loadReports();
      });
    }
  }
}
