import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BluiAuthErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { IBluiAuthErrorDialogService, ErrorDialogData } from './error-dialog.service';

@Injectable({
    providedIn: 'root',
})
export class BluiLoginErrorDialogService implements IBluiAuthErrorDialogService {
    constructor(public dialog: MatDialog) {}

    openDialog(data: ErrorDialogData): MatDialogRef<BluiAuthErrorDialogComponent> {
        const customErrorData: ErrorDialogData = {
            title: data?.title,
            message: data?.message || 'Your username/password combination is not recognized.',
        };
        return this.dialog.open(BluiAuthErrorDialogComponent, {
            disableClose: true,
            data: customErrorData,
        });
    }
}
