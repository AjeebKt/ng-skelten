import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from './confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  constructor(private dialog: MatDialog) { }
  openDialogModal(options: DialogModalOptions): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent);
    dialogRef.componentInstance.title = options.title.toString();
    dialogRef.componentInstance.message = options.message.toString();
    return dialogRef.afterClosed();
  }


}
export interface DialogModalOptions {
  title: string;
  message: string;
}



