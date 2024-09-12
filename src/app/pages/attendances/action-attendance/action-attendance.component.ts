import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AttendanceService} from "@services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-action-attendance',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './action-attendance.component.html',
  styleUrl: './action-attendance.component.scss'
})
export class ActionAttendanceComponent implements OnInit {
  controlNumber: string = '';
  isCheckedIn: boolean = false;
  isProcessing: boolean = false;

  constructor(
    private attendanceService: AttendanceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkInStatus();
  }

  registerAttendance() {
    this.isProcessing = true;
    if (this.isCheckedIn) {
      this.attendanceService.registerExit(this.controlNumber).subscribe(response => {
        alert('¡Salida registrada con éxito!');
        this.isCheckedIn = false;
        this.isProcessing = false;
        this.router.navigate(['/attendance-list']);
      }, error => {
        this.isProcessing = false;
        alert('Error al registrar la salida.');
      });
    } else {
      this.attendanceService.registerEntry(this.controlNumber).subscribe(response => {
        alert('¡Entrada registrada con éxito!');
        this.isCheckedIn = true;
        this.isProcessing = false;
      }, error => {
        this.isProcessing = false;
        alert('Error al registrar la entrada.');
      });
    }
  }

  isBefore5PM(): boolean {
    const currentHour = new Date().getHours();
    return currentHour < 17;
  }

  checkInStatus() {
    this.attendanceService.getAttendanceStatus(this.controlNumber).subscribe(data => {
      this.isCheckedIn = data.isCheckedIn;
    });
  }
}
