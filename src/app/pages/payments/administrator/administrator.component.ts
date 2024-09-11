import { Component, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DialogService } from '../../../_shared/modal/dialog.service';
import { PaymentService } from '@services';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialogConfig } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../_view/pdf-viewer/pdf-viewer.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../../../_core/pipes/filter.pipe';
import { AlertBannerComponent } from '../../../_shared/alert-banner/alert-banner.component';
import { Utils } from '../../../_core/utils/Utils';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [
    BtnColorDirective,
    MatTooltip,
    MatProgressBar,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    FilterPipe,
    AlertBannerComponent
  ],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.scss'
})
export class AdministratorComponent implements OnInit {
  @ViewChild('alertBannerComponent') alertBannerComponent: AlertBannerComponent;

  loadProcess: boolean = false;
  paymentsAll: any[] = [];
  searchText: string;
  constructor(
          private dialogService: DialogService,
          private documentService: PaymentService
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.loadProcess = true;
    this.documentService.getAll().subscribe({
      next: (data) => {
        this.paymentsAll = data.payments.map((val, index) => {
          return { ...val, isOpen: index === 0 }; // El primer elemento tendrá isOpen: true
        });
      },
      complete: () => { this.loadProcess = false;},
      error: () => { this.loadProcess = false;}
    });
  }

  toggleItem(index: number): void {
    this.paymentsAll[index].isOpen = !this.paymentsAll[index].isOpen;
  }

  showTestViewerPDF(document): void {
    if (document.hasOwnProperty('upload') && document.upload === 'No Cargado') {
      return this.alertBannerComponent.setMessage('No ah cargado el comprobante', 'error');
    }

    const nameFile = document.name ?? document.name_file;
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = {
      title: 'Ver Archivo de Pago de ' + nameFile,
      dialogData: { action: 'verify', item: document }
    };

    const dialogRef = this.dialogService.open(PdfViewerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(response => {
      if (Utils.isObject(response)) {
        const { status, id } = response.data;
        const index = this.paymentsAll.findIndex(teacher => teacher.id === id);
        if (index !== -1) {
          const find = this.paymentsAll[index];
          find.status = status;
          this.paymentsAll[index] = find;
        }
      }
    });
  }

}
