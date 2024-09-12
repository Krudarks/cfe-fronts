import {Component, Input, OnInit} from '@angular/core';
import {BtnColorDirective} from "../../../_core/directives/btn-color.directive";
import {CsInputDirective} from "../../../_core/directives/cs-input.directive";
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {VehicleService} from "../../../_core/services/vehicle.service";
import {TableActions} from "../../../_shared/table/TableActions";

@Component({
  selector: 'app-action-vehicle',
  standalone: true,
  imports: [
    BtnColorDirective,
    MatDialogClose,
    ReactiveFormsModule,
    CsInputDirective,
    MatProgressBar,
    NgIf
  ],
  templateUrl: './action-vehicle.component.html',
  styleUrl: './action-vehicle.component.scss'
})
export class ActionVehicleComponent implements OnInit {
  @Input() dialogData: any;

  formGroup: FormGroup;
  loadProcess: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ActionVehicleComponent>,
    private vehicleService: VehicleService,
  ) {
  }

  ngOnInit(): void {
    const {action, item} = this.dialogData;

    this.formGroup = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      plates: new FormControl('', [Validators.required]),
    });

    if (action === TableActions.edit) {
      this.formGroup.patchValue(item);
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.loadProcess = true;

    if (this.dialogData.action === TableActions.add) {
      return this.add(this.formGroup.value);
    }

    const { id } = this.dialogData.item;
    const data = { id, ...this.formGroup.value }; // Combina id y los datos del formulario en un solo objeto

    this.update(data);
  }

  private add(params):void{
    this.vehicleService.create(params).subscribe({
      next:(response):void=>{
        if (response.status){
          this.dialogRef.close(response);
        }
      },
      complete:():void => {
        this.loadProcess = false;
      },
      error: () => {
        this.loadProcess = false;
      },
    });
  }


  private update(params: any): void {
    this.vehicleService.update(params).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogRef.close(response);
        }
      },
      complete: () => {
        this.loadProcess = false;
      },
      error: () => {
        this.loadProcess = false;
      }
    });
  }
}
