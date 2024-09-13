import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttendanceService, LocalStorageService } from '@services';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AlertBannerComponent } from '../../../_shared/alert-banner/alert-banner.component';
import { AvatarModule } from 'ngx-avatars';
import { environment } from '@environment';

@Component({
  selector: 'app-action-attendance',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    AlertBannerComponent,
    ReactiveFormsModule,
    RouterLink,
    AvatarModule,
    NgClass
  ],
  templateUrl: './action-attendance.component.html',
  styleUrl: './action-attendance.component.scss'
})
export class ActionAttendanceComponent implements OnInit {
  user: any = null;
  loadProcess: boolean = false;
  formGroup: FormGroup;
  profileUrl: string | ArrayBuffer | any;
  constructor(
          private attendanceService: AttendanceService,
          public localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      employeeId: new FormControl('', [ Validators.required ]), // , Validators.email
    });
  }

  get isBefore5PM(): boolean {
    const currentHour = new Date().getHours();
    return currentHour < 17;
  }

  onSubmit(): void {
    this.loadProcess = true;
    this.attendanceService.registerEntry(this.formGroup.value).subscribe({
      next: (response) => {
        this.user = response;
        this.profileUrl = environment.apiUrl + '/api/users/getProfilePicture/' + this.user.worker.user.id;
      },
      error: error => {
        this.loadProcess = false;
      },
      complete: () => {
        this.loadProcess = false;
      }
    });
  }
}
