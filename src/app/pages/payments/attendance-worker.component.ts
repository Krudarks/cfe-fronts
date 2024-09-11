import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@services';
import { NgIf } from '@angular/common';
import { AdministratorComponent } from './administrator/administrator.component';
import {TestComponent} from "./test/test.component";

@Component({
  selector: 'app-attendance-worker',
  standalone: true,
  imports: [
    NgIf,
    AdministratorComponent,
    TestComponent
  ],
  templateUrl: './attendance-worker.component.html',
  styleUrl: './attendance-worker.component.scss'
})
export class AttendanceWorkerComponent implements OnInit {
  isAdmin: boolean = false;
  isTest: boolean = false;

  constructor(
          private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.localStorageService.isAdmin;
    this.isTest = this.localStorageService.isTest;

  }

}
