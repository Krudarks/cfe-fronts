import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[cs-input]',
  standalone: true
})
export class CsInputDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const classesToAdd = [
      'bg-gray-50',
      'border',
      'border-gray-300',
      'text-gray-900',
      'text-sm',
      'rounded-lg',
      'focus:ring-primary-600',
      'focus:border-primary-600',
      'block',
      'w-full',
      'p-2.5',
      'dark:bg-gray-700',
      'dark:border-gray-600',
      'dark:placeholder-gray-400',
      'dark:text-white',
      'dark:focus:ring-primary-500',
      'dark:focus:border-primary-500',
    ];

    classesToAdd.forEach(className => {
      this.renderer.addClass(this.el.nativeElement, className);
    });
  }
}
