import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@services';
import { environment } from '@environment';
import { NgIf, SlicePipe } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';
import { MatDialogConfig } from '@angular/material/dialog';
import { UserProfilePictureComponent } from '../../pages/users/user-profile-picture/user-profile-picture.component';
import { Utils } from '../../_core/utils/Utils';
import { DialogService } from '../../_shared/modal/dialog.service';

@Component({
    selector: 'app-user-data',
    standalone: true,
    templateUrl: './user-data.component.html',
    imports: [
        SlicePipe,
        NgIf,
        AvatarModule
    ],
    styleUrls: [ './user-data.component.scss' ]
})
export class UserDataComponent implements OnInit {

  userData: any;
  profileUrl: string | ArrayBuffer | any;
  constructor(
          public localStorageService: LocalStorageService,
          private dialogService: DialogService
          ) { }

  ngOnInit(): void {
    this.userData = this.localStorageService.getUserData;
    this.profileUrl = environment.apiUrl + '/api/users/getProfilePicture/' + this.userData.id;
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
