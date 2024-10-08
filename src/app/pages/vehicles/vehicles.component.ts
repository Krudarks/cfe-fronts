import { Component, OnInit, ViewChild } from '@angular/core';
import { BtnColorDirective } from "../../_core/directives/btn-color.directive";
import { FilterPipe } from "../../_core/pipes/filter.pipe";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatProgressBar } from "@angular/material/progress-bar";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableActions } from "../../_shared/table/TableActions";
import { DialogService } from "../../_shared/modal/dialog.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { VehicleService } from "../../_core/services/vehicle.service";
import { ActionVehicleComponent } from "./action-vehicle/action-vehicle.component";
import { Utils } from "../../_core/utils/Utils";
import { AlertBannerComponent } from "../../_shared/alert-banner/alert-banner.component";
import { LocalStorageService } from "@services";
import { Modal } from '../../_core/utils/Modal';
import { MatMenuModule } from '@angular/material/menu';
import {MatButton} from "@angular/material/button";

// Definir la interfaz para un vehículo
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plates: string;
  vehicle_number: string;
}

// Definir la interfaz para la respuesta del servicio
interface VehicleResponse {
  vehicles: Vehicle[];
  status: boolean;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    BtnColorDirective,
    MatMenuModule,
    FilterPipe,
    MatMenu,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule,
    MatMenuTrigger,
    NgClass,
    FormsModule,
    NgForOf,
    MatButton,
    AlertBannerComponent
  ],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;

  vehicles: Vehicle[] = [];
  searchText: string = '';
  viewTable: boolean = true;
  selectItem: Vehicle | undefined;
  actions = TableActions;
  loadProcess: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private dialogService: DialogService,
    private vehicleService: VehicleService,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    if (this.localStorageService.isAdmin) {
      this.isAdmin = true;
    }

    this.getVehicles();
  }

  private getVehicles(): void {
    this.loadProcess = true;
    this.vehicleService.getAll().subscribe({
      next: (response: VehicleResponse) => {
        if (response.status) {
          this.vehicles = response.vehicles;
          return;
        }
        this.vehicles = [];
      },
      complete: () => { this.loadProcess = false; },
      error: (err) => {
        console.error('Error al obtener los vehículos:', err);
        this.loadProcess = false;
      }
    });
  }

  setItem(item: Vehicle): void {
    this.selectItem = item;
  }

  changeView(type: string): void {
    this.viewTable = type === 'table';
  }

  actionVehicle(action: string): void {
    if (action === TableActions.edit && this.selectItem === undefined) return;
    const title: string = action === TableActions.add ? 'Nuevo Vehiculo' : 'Editar Vehiculo ' + (this.selectItem?.brand || '');

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

    const dialogRef = this.dialogService.open(ActionVehicleComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        if (result.status) {
          if (action === this.actions.add) {
            this.vehicles.push(result.data);
            this.alertBannerComponent.setMessage('Vehiculo Agregado con Éxito', 'success');
            return;
          }

          const { brand, model, plates, vehicle_number, id } = result.data;
          const index = this.vehicles.findIndex(vehicle => vehicle.id === id);
          if (index !== -1) {
            this.vehicles[index] = { ...this.vehicles[index], brand, model, plates, vehicle_number };
            this.alertBannerComponent.setMessage('Vehiculo Actualizado con Éxito', 'success');
          }
        }
      }
    });
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
        this.vehicleService.delete(item.id).subscribe({
          next: (response) => {
            if (response.status) {
              this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== item.id);
              this.alertBannerComponent.setMessage('Vehiculo Eliminado con Éxito', 'success');
            }
          },
          complete: () => { this.loadProcess = false; },
          error: () => { this.loadProcess = false; }
        });
      }
    });
  }

}
