import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string | string[];
  items?: MenuItem[];
}

@Component({
  selector: 'app-accordion-menu',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive ],
  templateUrl: './accordion-menu.component.html',
  styleUrl: './accordion-menu.component.scss'
})
export class AccordionMenuComponent {
  routerActivate: string = 'text-primary';

  @Input() menuItems: MenuItem[] = [];
}
