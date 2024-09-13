import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService, LocalStorageService } from '@services';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { AlertBannerComponent } from '../../../_shared/alert-banner/alert-banner.component';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { FilterPipe } from '../../../_core/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatMenu } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AvatarModule } from 'ngx-avatars';
import { environment } from '@environment';

@Component({
  selector: 'app-detail-attendance',
  standalone: true,
  imports: [
    DatePipe,
    AlertBannerComponent,
    BtnColorDirective,
    FilterPipe,
    FormsModule,
    MatMenu,
    MatProgressBar,
    NgIf,
    AvatarModule,
    NgClass
  ],
  templateUrl: './detail-attendance.component.html',
  styleUrl: './detail-attendance.component.scss'
})
export class DetailAttendanceComponent implements OnInit {
  attendanceDetails: any[] = [];
  searchText: string;
  viewTable: boolean = true;
  loadProcess: boolean = true;

  constructor(
          private route: ActivatedRoute,
          private attendanceService: AttendanceService,
          public localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const id: string = this.route.snapshot.paramMap.get('id');

    this.attendanceService.getAttendanceDetails({ date: id }).subscribe({
      next: (data) => {
        if (data.status) {
          this.attendanceDetails = data.attendances;
        }
      },
      complete: () => { this.loadProcess = false; },
      error: () => { this.loadProcess = false; }
    });
  }

  changeView(type: string): void {
    this.viewTable = type === 'table';
  }

  getProfile(user): string {
    return environment.apiUrl + '/api/users/getProfilePicture/' + user.worker.user.id;
  }
}
