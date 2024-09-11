import {Component, Input, OnInit} from '@angular/core';
import {AdministratorComponent} from "../payments/administrator/administrator.component";
import {TestComponent} from "../payments/test/test.component";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MenuItem} from "../../_shared/accordion-menu/accordion-menu.component";

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [
    AdministratorComponent,
    TestComponent,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './attendances.component.html',
  styleUrl: './attendances.component.scss'
})
export class AttendancesComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  openDropdown: number | null = null;
  attendanceReports = [
    { id: 1, noReporte: 1, fecha: '09/09/2024' },
    { id: 2, noReporte: 2, fecha: '10/09/2024' },

  ];

  constructor(private router: Router) {}

  toggleDropdown(reportId: number) {
    this.openDropdown = this.openDropdown === reportId ? null : reportId;
  }

  verReporte(reportId: number) {
    console.log('Ver reporte', reportId);
  }

  descargarReporte(reportId: number) {
    console.log('Descargar reporte', reportId);
  }

  editarReporte(reportId: number) {
    console.log('Editar reporte', reportId);
  }

  ngOnInit(): void {
  }
}
