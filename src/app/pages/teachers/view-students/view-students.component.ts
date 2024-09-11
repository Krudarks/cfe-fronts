import { Component, Input, OnInit } from '@angular/core';
import { BtnColorDirective } from '../../../_core/directives/btn-color.directive';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [
    BtnColorDirective,
    MatDialogClose
  ],
  templateUrl: './view-students.component.html',
  styleUrl: './view-students.component.scss'
})
export class ViewStudentsComponent implements OnInit {
  @Input() dialogData: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.dialogData);
  }
}
