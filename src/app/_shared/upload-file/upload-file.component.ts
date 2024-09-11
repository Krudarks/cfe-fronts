import { Component, Input } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FileSizePipe } from '../../_core/pipes/file-size.pipe';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    DatePipe,
    FileSizePipe,
    NgIf
  ],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {
  @Input() multiple: boolean = false; // Por defecto, solo se permite un archivo
  @Input() acceptedFileTypes: string = 'application/pdf';

  isDragging: boolean = false;
  isDraggingFail: boolean = false;
  files: File[] = []; // Variable para almacenar los archivos cargados

  // Método para construir FormData con los archivos cargados
  get buildFormData(): FormData {
    const formData = new FormData();
    if (this.multiple) {
      // Si se permiten múltiples archivos, agregar todos al FormData
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files', this.files[i]);
      }
    } else {
      // Si solo se permite un archivo, agregar el primero al FormData
      formData.append('file', this.files[0]);
    }
    return formData;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.isDraggingFail = !this.multiple && this.files.length === 1;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    this.isDraggingFail = false;
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      if (!this.multiple && this.files.length === 1) {
        console.log('Solo se permite seleccionar un archivo');
        return;
      }

      this.uploadFile(files);
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (files.length > 0) {
      if (!this.multiple && this.files.length === 1) {
        console.log('Solo se permite seleccionar un archivo');
        return;
      }

      this.uploadFile(files);
    }
  }

  uploadFile(files): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFileType(file)) {
        this.files.push(file);
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = this.acceptedFileTypes.split(',');
    return allowedTypes.includes(file.type);
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

}
