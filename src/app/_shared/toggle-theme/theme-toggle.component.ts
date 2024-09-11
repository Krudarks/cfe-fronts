import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { MatIconAnchor } from '@angular/material/button';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  imports: [ CommonModule, MatIconAnchor ],
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription | undefined = undefined;
  elementBody: HTMLElement = document.querySelector('#appBody');
  darkClassName: string = 'dark-theme';

  constructor(readonly themeService: ThemeService) {}

  ngOnInit(): void {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        'matchMedia' in window &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.themeService.setTheme('dark');
      document.documentElement.classList.add('dark');
      this.elementBody.classList.add(this.darkClassName);
    } else {
      this.themeService.setTheme('light');
      this.elementBody.classList.remove(this.darkClassName);
      document.documentElement.classList.remove('dark');
    }

    this.themeSubscription = this.themeService.$theme
      .asObservable()
      .subscribe((theme) => {
        localStorage.setItem('color-theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          this.elementBody.classList.add(this.darkClassName);
        } else {
          document.documentElement.classList.remove('dark');
          this.elementBody.classList.remove(this.darkClassName);
        }
      });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }
}
