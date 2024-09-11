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
    CsInputDirective,
    MatDialogClose,
    MatProgressBar,
    NgIf,
    ReactiveFormsModule
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

    this.update(id, this.formGroup.value);
  }

  private add(params): void {
    this.vehicleService.create(params).subscribe({
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

  private update(id, params): void {
    this.vehicleService.update(id, params).subscribe({
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
