import { Component } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    MatDialogClose
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

}
