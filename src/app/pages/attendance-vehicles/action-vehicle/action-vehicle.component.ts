import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {AttencarService} from "../../../_core/services/attencar.service";

@Component({
  selector: 'app-action-vehicle',
  standalone: true,
  imports: [
    MatProgressBar,
    NgIf,
    NgForOf,
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './action-vehicle.component.html',
  styleUrl: './action-vehicle.component.scss'
})
export class ActionVehicleComponent implements OnInit{
  vehicles: any[] = [];
  statuses: any[] = [];

  @Output() modalClose = new EventEmitter<void>();
  @Output() reportSaved = new EventEmitter<void>();

  constructor(private attencarService: AttencarService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    // Obtener vehículos y estados desde el servicio
    this.attencarService.getVehiclesForReport().subscribe((data) => {
      this.vehicles = data.vehicles;
      this.statuses = data.statuses;
    });
  }

  saveReport(): void {
    const reportData = {
      vehicles: this.vehicles,
      date: new Date().toISOString().split('T')[0]
    };

    this.attencarService.saveDailyReport(reportData).subscribe(() => {
      this.reportSaved.emit();  // Emitir el evento de reporte guardado
    });
  }

  closeModal(): void {
    this.modalClose.emit();  // Emitir el evento para cerrar el modal
  }
}
