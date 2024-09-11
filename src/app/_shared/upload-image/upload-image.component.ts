import { Component, Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss'
})
export class UploadImageComponent {
  @Input() multiple: boolean = false; // Por defecto, solo se permite un archivo
  isDragging: boolean = false;
  isDraggingFail: boolean = false;

  files: File[] = []; // Variable para almacenar los archivos cargados
  acceptedFileTypes: string = 'image/svg+xml,image/png,image/jpeg,image/gif'; // Tipos de archivo aceptados
  filePreviewMap: Map<File, string> = new Map();

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

      this.uploadImg(files);
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

      this.uploadImg(files);
    }
  }

  uploadImg(files): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFileType(file)) {
        this.files.push(file);
        this.generatePreview(file);
      }
    }
  }

  convertBase64ToFile(base64String: string, fileName): File {
    // Obtener el tipo de archivo desde la cadena Base64
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    // Obtener los datos base64 codificados de la cadena
    const byteString = atob(base64String.split(',')[1]);
    // Crear un ArrayBuffer para almacenar los datos binarios
    const arrayBuffer = new ArrayBuffer(byteString.length);
    // Crear una unidad de 8 bits sin signo
    const uint8Array = new Uint8Array(arrayBuffer);
    // Iterar sobre cada caracter y convertirlo a datos binarios
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    // Crear un Blob con los datos binarios y el tipo de archivo
    const blob = new Blob([ arrayBuffer ], { type: mimeString });

    return new File([ blob ], fileName, { type: mimeString });
  }

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

  private isValidFileType(file: File): boolean {
    const allowedTypes = this.acceptedFileTypes.split(',');
    return allowedTypes.includes(file.type);
  }

  private generatePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.filePreviewMap.set(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeFile(index: number): void {
    const fileToRemove = this.files[index];
    this.files.splice(index, 1);
    this.filePreviewMap.delete(fileToRemove);
  }

}
