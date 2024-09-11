import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.scss'
})
export class AlertBannerComponent {
  message: string | null = null;
  type: 'error' | 'success' | 'info' | 'warning' = 'info';

  getAlertClasses(): string {
    switch (this.type) {
      case 'error':
        return 'text-red-800 border-t-4 border-red-300 bg-red-50';
      case 'success':
        return 'text-green-800 border-t-4 border-green-300 bg-green-50';
      case 'info':
        return 'text-blue-800 border-t-4 border-blue-300 bg-blue-50';
      case 'warning':
        return 'text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50';
      default:
        return 'text-blue-800 border-t-4 border-blue-300 bg-blue-50';
    }
  }

  setMessage(message: string, type: 'error' | 'success' | 'info' | 'warning'): void {
    this.message = message;
    this.type = type;
  }
}
