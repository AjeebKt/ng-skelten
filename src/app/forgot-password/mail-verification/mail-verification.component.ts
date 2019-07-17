import { ProgressBarService } from './../../core/services/progress-bar.service';
import { MailverificationService } from './mailverification.service';
import { SnackBarService } from './../../core/services/snack-bar.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.scss']
})
export class MailVerificationComponent implements OnInit {
  message: string;
  constructor(private notify: SnackBarService,
    private route: ActivatedRoute,
    private mailSuccessfulService: MailverificationService,
    private progressbarService: ProgressBarService) { }

  ngOnInit() {
    const type = this.route.snapshot.queryParams['type'];
    const encryptData = JSON.parse(this.route.snapshot.queryParams['encryptData']);
    let url;
    if (type === 'unsubcriptionVerification') {
      url = 'mobile/unSubscriberUser';
    } else if (type === 'forgetPassword') {
      url = ('web/resetPassword');
    } else if (type === 'inviteGuardian') {
      url = 'app/guardianverification';
    }
    // console.log(url);
    this.mailSuccessfulService.verification(encryptData, url).subscribe(
      response => {
        // console.log(response);
        this.message = response.response;
      },
      error => {
        console.log(error);
      });
  }
  }
