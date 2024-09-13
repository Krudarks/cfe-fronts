import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { map, Observable, shareReplay, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AccordionMenuComponent, MenuItem } from '../_shared/accordion-menu/accordion-menu.component';
import { Menu } from './menu';
import { ThemeToggleComponent } from '../_shared/toggle-theme/theme-toggle.component';
import { LocalStorageService, LogoutService } from '@services';
import { UserDataComponent } from './user-data/user-data.component';
import { DialogService } from '../_shared/modal/dialog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, MaterialModule, RouterLink, RouterOutlet, AccordionMenuComponent, ThemeToggleComponent, UserDataComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', { static: true }) sidenav: any;

  menuItems: MenuItem[] = [];

  isSidenavOpened: boolean = false;

  destroy: Subject<void> = new Subject();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(map((result: BreakpointState) => result.matches), shareReplay());

  constructor(
          public breakpointObserver: BreakpointObserver,
          public logoutService: LogoutService,
          public dialogService: DialogService,
          private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    if (this.localStorageService.isAdmin) {
      const labelTeacher = [
        'layout', 'users', 'vehicles',
        'attendance-worker', 'attendance_car',
      ];
      this.menuItems = Menu.filter(val => labelTeacher.includes(val.code));
      return;
    }
    if (this.localStorageService.isTest) {
      const labelTeacher = [ ];
      this.menuItems = Menu.filter(val => labelTeacher.includes(val.code));
      return;
    }
    if (this.localStorageService.isWorker) {
      const labelStudents = [  ];
      this.menuItems = Menu.filter(val => labelStudents.includes(val.code))
      .sort((a, b) => labelStudents.indexOf(a.code) - labelStudents.indexOf(b.code));
      return;
    }
  }

  toggleSidenav(): any {
    this.isSidenavOpened = !this.isSidenavOpened;
    if (this.isSidenavOpened) {
      return this.sidenav.open();
    }
    return this.sidenav.close();
  }

  flipSidenav(): void {
    if (this.isSidenavOpened) {
      this.toggleSidenav();
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

}
