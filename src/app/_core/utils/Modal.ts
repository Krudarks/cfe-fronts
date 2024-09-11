import { MatDialogConfig } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../../_shared/dialog-confirmation/dialog-confirmation.component';
import { LogoutComponent } from '../../_shared/logout/logout.component';

export interface DialogData {
    title: string;
    message: any;
    type?: string;
    hiddeCanceled?: boolean;
}

export class Modal {

    static confirmationDialog(dialog, data: DialogData) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        dialogConfig.width = '450px';
        dialogConfig.maxWidth = '450px';
        dialogConfig.hasBackdrop = true;
        dialogConfig.panelClass = 'dialog-no-padding';

        return dialog.open(DialogConfirmationComponent, dialogConfig);
    }

    static confirmationLogout(dialog) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '450px';
        dialogConfig.maxWidth = '450px';
        dialogConfig.hasBackdrop = true;
        dialogConfig.panelClass = 'dialog-no-padding';

        return dialog.open(LogoutComponent, dialogConfig);
    }

}
