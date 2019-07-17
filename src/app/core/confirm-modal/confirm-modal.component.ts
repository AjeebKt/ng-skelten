import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { GlobalDataService } from '../services/global-data.service';

@Component({
    selector: 'app-confirm-modal',
    template: `
  <div class="delete  right-page-btns">
    <p>{{ message }}</p>
    <button type="button" class="btn btn-defaul "style=""
        (click)="dialogRef.close(false)">Cancel</button>
        <button type="button" class="btn btn-defaul "  appAutofocus     (click)="dialogRef.close(true)">Confirm</button>
    </div>`,
    styles: [`p{
    text-align: center;
}
button{
    box-shadow: none !important;
}
.doneClr{
  float:right;
    /* border: none !important; */
}

.cancelClr:hover{
    background-color: #fff !important;
}
delete {
    border-radius: 4px;
    /* min-width: 100px;
    min-height: 100px; */
}
    p {
      text-align: center;
      overflow: hidden;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  }`]
})
export class ConfirmModalComponent implements OnInit {

    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>, private globalDatService: GlobalDataService) {

    }
    ngOnInit() {
        this.dialogRef.afterClosed().subscribe(() => {
            this.globalDatService.focusChange.next();
        });
    }

}
