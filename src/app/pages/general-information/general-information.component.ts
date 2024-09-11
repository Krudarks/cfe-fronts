import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from '../../_shared/modal/dialog.service';
import { LocalStorageService } from '@services';
import { NgIf } from '@angular/common';
import { CsInputDirective } from '../../_core/directives/cs-input.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Utils } from '../../_core/utils/Utils';
import { UserProfilePictureComponent } from '../users/user-profile-picture/user-profile-picture.component';
import { environment } from '@environment';
import { AvatarModule } from 'ngx-avatars';

@Component({
  selector: 'app-general-information',
  standalone: true,
    imports: [
        NgIf,
        CsInputDirective,
        FormsModule,
        ReactiveFormsModule,
        AvatarModule
    ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss'
})
export class GeneralInformationComponent implements OnInit {

  profileUrl: string | ArrayBuffer | any;
  userData: any;
  isAdmin: boolean = false;
  isTeacher: boolean = false;
  isStudent: boolean = false;

  constructor(
          private dialogService: DialogService,
          public localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.userData = this.localStorageService.getUserData;
    this.isAdmin = this.localStorageService.isAdmin;
    this.isTeacher = this.localStorageService.isTest;
    this.isStudent = this.localStorageService.isWorker;
    this.profileUrl = environment.apiUrl + '/api/users/getProfilePicture/' + this.userData.id;
  }

  changePassword(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'dialog-no-padding';
    dialogConfig.data = {
      icon: 'fa-solid fa-lock',
      title: 'Cambiar Contraseña',
    };

    this.dialogService.open(ChangePasswordComponent, dialogConfig);
  }

  uploadProfile(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '744px';
    dialogConfig.panelClass = 'dialog-no-padding';
    dialogConfig.data = {
      dialogData: this.userData,
      icon: 'fa-solid fa-id-card-clip',
      title: 'Editar Foto de Perfil',
      secondModalLevel: true,
    };

    const dialogRef = this.dialogService.open(UserProfilePictureComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(response => {
      if (Utils.isObject(response)){
        if (response.status && response.type == 'delete_image') {
          this.profileUrl = environment.apiUrl + '/api/users/getProfilePicture/0';
        } else {
          this.preview(response);
        }
      }
    });
  }

  preview(file): void {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.profileUrl = reader.result;
    };
  }
}
