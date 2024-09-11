import { Component, OnInit } from '@angular/core';
import { LocalStorageService, PaymentsTeacherService } from '@services';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';
import { FilterPipe } from '../../_core/pipes/filter.pipe';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialogConfig } from '@angular/material/dialog';
import { Utils } from '../../_core/utils/Utils';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { DialogService } from '../../_shared/modal/dialog.service';
import { ADMIN } from '../../_core/constants/Roles.constants';

@Component({
  selector: 'app-payments-teacher',
  standalone: true,
  imports: [
    BtnColorDirective,
    FilterPipe,
    MatMenuTrigger,
    MatMenu
  ],
  templateUrl: './payments-teacher.component.html',
  styleUrl: './payments-teacher.component.scss'
})
export class PaymentsTeacherComponent implements OnInit {
  isAdmin: boolean = false;
  loadProcess: boolean = false;
  paymentsAll: any[] = [];
  searchText: string = '';
  selectItem: any;

  constructor(
          private localStorageService: LocalStorageService,
          private dialogService: DialogService,
          private paymentsTeacherService: PaymentsTeacherService,
  ) { }

  ngOnInit(): void {
    const userData = this.localStorageService.getUserData;
    this.isAdmin = userData.role.code === ADMIN;
    if (this.isAdmin) {
      return this.viewAdmin();
    }
    this.viewTeacher();
  }

  addPayment(): void {
    const config: MatDialogConfig<any> = {
      width: '50%',
      
      data: {
        title: 'Realizar Pago',
        dialogData: {
          action: 'payment',
          item: ''
        }
      }
    };

    const dialogRef = this.dialogService.open(AddPaymentComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isObject(result)) {
        this.paymentsAll.push(result.data);
      }
    });
  }

  private viewAdmin(): void {
    this.loadProcess = true;
    this.paymentsTeacherService.getAll().subscribe({
      next: (data) => {
        this.paymentsAll = data.payments;
      },
      complete: () => { this.loadProcess = false;},
      error: () => { this.loadProcess = false;}
    });
  }

  private viewTeacher(): void {
    this.loadProcess = true;
    this.paymentsTeacherService.getByUser().subscribe({
      next: (data) => {
        if (data.status) {
          this.paymentsAll = data.payments;
        }
      },
      complete: () => { this.loadProcess = false;},
      error: () => { this.loadProcess = false;}
    });
  }

  setItem(item): void {
    this.selectItem = item;
  }

}
