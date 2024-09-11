import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '@services';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatLabel } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { ImageCroppedEvent, ImageCropperModule, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-user-profile-picture',
  templateUrl: './user-profile-picture.component.html',
  styleUrls: [ './user-profile-picture.component.scss' ],
  standalone: true,
    imports: [ CommonModule, MatSlider, MatLabel, MatDivider, MatButton, MatSliderThumb, ImageCropperModule, MatDialogClose ]
})
export class UserProfilePictureComponent implements OnInit {
  @Input() dialogData: any;

  imageChangedEvent: any;
  croppedImage: any;
  canvasRotation: number = 0;
  rotation: number = 0;
  scale: number = 1;
  transform: ImageTransform = {};
  croppedImageConvert: any;
  url: any;
  buttonDisabled: boolean;
  user_id: number = 0;
  
  constructor(
          private matDialogRef: MatDialogRef<UserProfilePictureComponent>,
          private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user_id = this.dialogData.id;

    this.userService.profileSetting(this.user_id).subscribe({
      next:(response)=>{
        if (response) {
          const config = response.config;

          this.getProfile();
          const settings = config?.crop_setting;
          if (settings === undefined) {
            return;
          }
          const profileSetting = JSON.parse(settings);

          this.scale = profileSetting.scale;
          this.rotation = profileSetting.rotation;
          this.canvasRotation = profileSetting.canActivate;

          this.transform = {
            ...this.transform,
            rotate: this.rotation,
            scale: this.scale
          };
        }
      }
    });
  }

  private getProfile(): void {
    this.userService.getProfile(this.user_id).subscribe(x => {
      this.url = this.preview(x);
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.croppedImageConvert = this.convertImage(this.croppedImage, 'profile.png');
  }

  convertImage(dataurl, filename): File {
    let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([ u8arr ], filename, { type: mime });
  }

  zoom(e): void {
    this.scale = e;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  rotationUpdate(e): void {
    this.rotation = e;
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  uploadProfile(): void {
    this.buttonDisabled = true;
    const formData = new FormData();
    if (!this.imageChangedEvent) {
      formData.append('profile_original', 'original_profile_picture.png');
    } else {
      formData.append('profile_original', this.imageChangedEvent.target.files[0]);
    }

    const crop_setting = {
      scale: this.scale,
      rotation: this.rotation,
      canvasRotation: this.canvasRotation ? this.canvasRotation:0,
      transform: {}
    };

    formData.append('user_id', JSON.stringify(this.user_id));
    formData.append('crop_setting', JSON.stringify(crop_setting));
    formData.append('profile', this.croppedImageConvert);

    this.userService.addUserPicture(formData).subscribe({
      next: (response) => {
        if (response.status) {
          this.matDialogRef.close(this.croppedImageConvert);
        }
        this.buttonDisabled = false;
      }, error: () => {
        this.buttonDisabled = false;
      }
    });
  }

  deleteProfile(): void {
    this.buttonDisabled = true;
    const userId = { user_id: this.user_id };
    this.userService.deleteProfile(userId).subscribe({
      next: (response) => {
        if (response.status) {
          this.matDialogRef.close(response);
          this.buttonDisabled = false;
        }
      }, error: () => {
        this.buttonDisabled = false;
      }
    });
  }

  preview(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.url = reader.result;
    };
  }

}
