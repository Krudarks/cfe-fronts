import { Directive, ElementRef, Input } from '@angular/core';

export enum ButtonColor {
  primary = 'primary',
  danger = 'danger',
  success = 'success',
  warning = 'warning',
  default = 'default',
}

@Directive({
  selector: '[btn-color]',
  standalone: true
})
export class BtnColorDirective {
  @Input() color: string | ButtonColor;
  @Input() raised: boolean  = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const button = this.el.nativeElement;

    const colorStyles = {
      'primary': {
        classes: [ 'bg-primary-700', 'hover:bg-primary-800', 'focus:ring-primary-300', 'dark:bg-primary-600', 'dark:hover:bg-primary-700', 'dark:focus:ring-primary-800' ]
      },
      'danger': {
        classes: [ 'bg-red-700', 'hover:bg-red-800', 'focus:ring-red-300', 'dark:bg-red-900', 'dark:hover:bg-red-800', 'dark:focus:ring-red-700' ]
      },
      'success': {
        classes: [ 'bg-green-500', 'hover:bg-green-600', 'focus:ring-green-300', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'dark:focus:ring-green-800' ]
      },
      'warning': {
        classes: [ 'bg-yellow-500', 'hover:bg-yellow-600', 'focus:ring-yellow-300', 'dark:bg-yellow-700', 'dark:hover:bg-yellow-600', 'dark:focus:ring-yellow-800' ]
      },
      'default': {
        classes: [ 'bg-gray-300', 'hover:bg-gray-400', 'focus:ring-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'dark:focus:ring-gray-800' ]
      }
      // Puedes agregar más colores aquí siguiendo el mismo patrón
    };

    // Verificar si se ha proporcionado un color o si es nulo o vacío
    const selectedColor = this.color && colorStyles[this.color] ? this.color:'primary';
    const color = colorStyles[selectedColor];

    // Remover la primera clase si raised es true
    const filteredClasses = this.raised ? color.classes.slice(1) : color.classes;

    // Agregar clases de estilo correspondientes al botón
    button.classList.add(
            'inline-flex',
            'items-center',
            'px-3',
            'py-2',
            'text-sm',
            'font-medium',
            'text-center',
            'text-white',
            'rounded-lg',
            ...filteredClasses
    );
  }
}
