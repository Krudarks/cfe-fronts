import { Directive, ElementRef, Renderer2, NgZone, OnInit, Input } from '@angular/core';
import { LoaderService } from './loader.service';

@Directive({
  selector: '[appLoader]',
  standalone: true
})
export class LoaderDirective implements OnInit {
  @Input() startText: string = '';
  @Input() startIcon: string = '';

  constructor(
          private el: ElementRef,
          private renderer2: Renderer2,
          private loaderService: LoaderService,
          private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.loaderService.isLoading.subscribe((isLoading: boolean) => {
        this.ngZone.run(() => {
          if (isLoading) {
            return this.enabled();
          }
          this.disabled();
        });
      });
    });
  }

  // desactiva loader
  private disabled(): void {
    this.elBtn.disabled = false;
    this.elBtn.innerHTML = ''; // Limpiar el contenido actual del botón

    const spanElement = this.renderer2.createElement('span'); // Crear un nuevo elemento span

    if (this.startIcon !== '') {
      const iconClasses = this.startIcon.split(' '); // Divide la cadena en un arreglo de clases
      const elementI = this.renderer2.createElement('i');

      for (const className of iconClasses) {
        this.renderer2.addClass(elementI, className); // Agrega cada clase por separado al icono
      }

      this.renderer2.appendChild(spanElement, elementI); // Agregar el icono al span
    }

    const textNode = this.renderer2.createText(' ' + this.startText); // Espacio antes del texto para separar el icono
    this.renderer2.appendChild(spanElement, textNode); // Agregar el texto al span

    this.renderer2.appendChild(this.el.nativeElement, spanElement); // Agregar el span al botón
  }

  // activa loader
  private enabled(): void {
    this.elBtn.disabled = true;

    this.elBtn.textContent = 'Cargando...';

    const elementI = this.renderer2.createElement('i');
    this.renderer2.addClass(elementI, 'fa');
    this.renderer2.addClass(elementI, 'fa-solid');
    this.renderer2.addClass(elementI, 'fa-spinner');
    this.renderer2.addClass(elementI, 'fa-spin-pulse');
    this.renderer2.addClass(elementI, 'fa-spin-reverse');

    this.renderer2.appendChild(this.el.nativeElement, elementI);
  }

  private get elBtn(): HTMLButtonElement {
    return this.el.nativeElement as HTMLButtonElement;
  }

}
