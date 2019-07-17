import { SnackBarService } from '../../../core/services/snack-bar.service';
import { Component, OnInit } from '@angular/core';
import { ENTER, SPACE, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { UserListService } from '../user-list/user-list.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss']
})
export class InviteUsersComponent implements OnInit {
  fileUpload: any;
  uploadedFile: any;
  hospitalID: any;
  hospitalName: any;
  inviteParameters: any;
  suboperatorID: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, SPACE, COMMA];

  emails = [];
  emailListInvite = [];

  constructor(
    private notify: SnackBarService,
    private userListService: UserListService,
    private router: Router,
    public dialogRef: MatDialogRef<InviteUsersComponent>,

  ) { }

  ngOnInit() {
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((this.emails.length === 0)) {
      this.separatorKeysCodes = [SPACE, COMMA];
    }
    if ((this.emailListInvite.length !== 0)) {
      this.separatorKeysCodes = [SPACE, COMMA];
    } else {
      this.separatorKeysCodes = [ENTER, SPACE, COMMA];
    }
    if (value !== '') {
      const pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
      if (pattern.test(value)) {
        // Add our fruit
        if ((value || '').trim()) {
          this.emails.push({ name: value.trim() });
          this.emailListInvite.push(value.trim());
          this.separatorKeysCodes = [ENTER, SPACE, COMMA];
        }
        // Reset the input value
        if (input) {
          input.value = '';
        }
      } else {
        this.notify.openSnackBar('Enter a valid email !', '');
      }
    }
  }
  remove(emailR: any): void {
    const index = this.emails.indexOf(emailR);
    if (index >= 0) {
      this.emails.splice(index, 1);
      this.emailListInvite.splice(index, 1);
    }
  }
  inviteUsers() {
    if (this.emailListInvite.length === 0) {
      this.notify.openSnackBar('Enter a valid email !', '');
    } else {
      this.userListService.inviteIndividualUsers(this.emailListInvite)
        .subscribe((response) => {
          if (response.status = 200 || response === 'Success') {
            this.emails = [];
            this.emailListInvite = [];
            this.notify.openSnackBar('Invitation sent successfully !', '');
            this.router.navigate(['/app/dashboard/user-management']);
            this.dialogRef.close(true);
          } else {
            this.notify.openSnackBar('Can\'t process !', '');
          }
        },
          error => {
            if (error.error.text === 'Success') {
              this.notify.openSnackBar('Invitation sent successfully !', '');
              this.router.navigate(['/app/dashboard/user-management']);
              this.dialogRef.close(true);
            }
          });
    }
  }
}
