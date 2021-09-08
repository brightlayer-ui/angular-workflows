import { MatDialogRef } from '@angular/material/dialog';

export type IPxbAuthErrorDialogService = {
    openDialog(data: ErrorDialogData): MatDialogRef<any>;
};

export type ErrorDialogData = {
    title: string;
    message: string;
};

export type LoginErrorDialogData = ErrorDialogData & {
    mode?: Array<'dialog' | 'message-box' | 'form' | 'none'>;
    dismissible?: boolean;
    position?: 'top' | 'bottom';
};
