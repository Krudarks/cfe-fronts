import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  template: '<router-outlet />',
})
export class AppComponent {

  constructor() { initFlowbite(); }
}
