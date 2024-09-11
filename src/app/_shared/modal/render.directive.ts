import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';

@Directive({
  selector: '[renderComponent]',
  standalone: true
})
export class RenderDirective implements OnInit {
  @Input() dialogData: any;
  @Input() component: ComponentType<any>;

  componentRef: any;

  /**
   * The ComponentFactoryResolver will be used to resolve the component at run time.
   * This service contains resolveComponentFactory method which can be used to create a component at run time.
   * The ViewContainerRef to gain access to the view container of the element that will host the dynamically added component.
   * @param {ViewContainerRef} container
   */
  constructor(private container: ViewContainerRef) { }

  ngOnInit(): void {
    this.componentRef = this.container.createComponent(this.component);
    this.componentRef.instance.dialogData = this.dialogData;
  }

}
