import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer/src/ng2-pdfjs-viewer.component';
import { environment } from '@environment';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { BtnColorDirective } from '../../_core/directives/btn-color.directive';
import { DocumentService, PaymentService } from '@services';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: [ './pdf-viewer.component.scss' ],
  standalone: true,
  imports: [ NgIf, MatProgressBar, PdfJsViewerModule, MatDialogActions, MatButton, MatDialogClose, BtnColorDirective ],
})
export class PdfViewerComponent implements OnInit {
  @ViewChild('pdfJsViewerComponent') pdfJsViewerComponent: PdfJsViewerComponent;
  @Input() dialogData: any;
  src: Uint8Array | any;
  pdfAssetsPath: string = environment.pdfjsAssetsPath;
  loading: boolean = true;
  loadProcess: boolean = false;
  verifyPayment: boolean = false;

  constructor(
          private dialogRef: MatDialogRef<PdfViewerComponent>,
          private documentService: DocumentService,
          private paymentService: PaymentService,
  ) { }

  ngOnInit(): void {
    if (this.dialogData === undefined) {
      this.src = 'https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf';
      this.loading = false;
      return;
    }

    this.verifyPayment = this.dialogData.action === 'verify';
    if (this.dialogData.action === 'payments' || this.verifyPayment) {
      this.getPayment();
      return;
    }

    this.getDocument();
  }

  private getPayment(): void {
    this.loading = true;
    let user_id: number;
    if (this.verifyPayment) {
      user_id = this.dialogData.item.id;
    } else {
      if (this.dialogData.item.hasOwnProperty('student_id')) {
        user_id = this.dialogData.item.student_id;
      } else {
        user_id = this.dialogData.item.id;
      }
    }

    this.paymentService.getById(user_id).subscribe({
      next: (data) => {
        if (data.status) {
          this.src = Uint8Array.from(atob(data.document64), c => c.charCodeAt(0));
        }
      },
      complete: () => { this.loading = false;},
      error: () => { this.loading = false;}
    });
  }

  private getDocument(): void {
    this.loading = true;
    const { id } = this.dialogData.item;
    this.documentService.getById(id).subscribe({
      next: (data) => {
        this.src = Uint8Array.from(atob(data.document64), c => c.charCodeAt(0));
      },
      complete: () => { this.loading = false;},
      error: () => { this.loading = false;}
    });
  }

  public approvePayment(type): void {
    this.loadProcess = true;
    const { student_id, id } = this.dialogData.item;
    const params = {
      payment_id: id,
      status: type ? 'approve':'denied',
      student_id: student_id
    };

    this.paymentService.updateStatus(params).subscribe({
      next: (data) => {
        if (data.status) {
          this.dialogRef.close(data);
        }
      },
      complete: () => { this.loading = false;},
      error: () => { this.loading = false; }
    });
  }

}
