export class Download {

    /*
    * Descarga el archivo formato base 64
    */
    static fileDownloadBase64(base64File: string, name_file: string): void {
        // Decodificar el base64 y crear un Blob
        const decodedData = atob(base64File);
        const blob = new Blob([ decodedData ], { type: 'application/xml' });

        // Crear un enlace (link) para descargar el archivo
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Definir el nombre del archivo
        link.download = name_file;

        // Simular un clic en el enlace para iniciar la descarga
        link.click();

        // Liberar recursos
        URL.revokeObjectURL(link.href);
    }

    /*
    * Abre el Archivo en una ventana nueva
    */
    static fileOpenWindows(fileBlob: Blob | MediaSource): void {
        const blobUrl = URL.createObjectURL(fileBlob);
        // Abrir una nueva ventana o pestaña con el PDF
        window.open(blobUrl, '_blank');

        // Liberar el objeto URL
        URL.revokeObjectURL(blobUrl);
    }

    /*
    * Descarga el archivo
    */
    static DownloadFile(fileObj: Blob | MediaSource, pathName: string): void {
        const file = window.URL.createObjectURL(fileObj);
        const downloadL = document.createElement('a');

        downloadL.href = file;
        downloadL.setAttribute('download', pathName);
        document.body.appendChild(downloadL);
        downloadL.click();
    }
}
