import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AttendanceService} from "@services";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-detail-attendance',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './detail-attendance.component.html',
  styleUrl: './detail-attendance.component.scss'
})
export class DetailAttendanceComponent implements OnInit{
  attendance: any = {};

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.attendanceService.getAttendanceDetails(id).subscribe(data => {
      this.attendance = data;
    });
  }
}
