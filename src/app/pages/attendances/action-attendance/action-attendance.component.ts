import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-action-attendance',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './action-attendance.component.html',
  styleUrl: './action-attendance.component.scss'
})
export class ActionAttendanceComponent {
  controlNumber: string = '';

  registerAttendance() {
    if (this.controlNumber) {
      // Lógica para registrar la asistencia
      console.log('Asistencia registrada para el número de control:', this.controlNumber);
    }
  }
}
