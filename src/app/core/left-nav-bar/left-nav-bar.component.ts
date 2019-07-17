import { CurrentUser } from 'src/app/model/current-user';
import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';
import { ProgressBarService } from '../services/progress-bar.service';
import { Observable } from 'rxjs';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { LoginService } from 'src/app/login/login.service';
import { Hospital } from 'src/app/model/hospital';

declare const $: any;

declare var sideBtnClick: any;
@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.scss']
})
export class LeftNavBarComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private renderer: Renderer2,
    private gd: GlobalDataService, private confirmDialogService: ConfirmModalService,
    private loginService: LoginService,
    private progressbarService: ProgressBarService) { }
  loggedusername: string;
  currentUSer: string;

  currentUserName: string;
  hospitalName: string;
  loggedInUser: string;
  lastLogin: Date;
  imageselected: any;
  hosName: any;
  @ViewChild('appSettings') appSettingsRef: ElementRef;

  // profileImage = 'assets/images/colife-logo-symbol.png';
  profileImage = 'assets/images/colife-logo-symbol.png';

  @HostListener('window:beforeunload')
  onBeforeUnload(): Observable<boolean> | boolean {
    sessionStorage.setItem('currentUser', JSON.stringify(
      this.gd.currentUser
    ));
    // console.log(sessionStorage.getItem('currentUser'), 'currentUser');
    sessionStorage.setItem('currentHospital', JSON.stringify(this.gd.currentHospital));
    sessionStorage.setItem('currentMenu', this.gd.currentMenu);
    sessionStorage.setItem('currentSubOpConfig', this.gd.currentSubOpConfig);
    const tempId = this.gd.tempId ? sessionStorage.setItem('tempId', this.gd.tempId) : null;
    const uided = this.gd.userIdToEdit ? sessionStorage.setItem('userIdtoEdit', JSON.stringify(this.gd.userIdToEdit)) : null;
    const doctorIdToEdit = this.gd.doctorIdToEdit ? sessionStorage.setItem('doctorIdToEdit',
      JSON.stringify(this.gd.doctorIdToEdit)) : null;
    const caregiverToEdit = this.gd.caregiverToEdit ? sessionStorage.setItem('caregiverToEdit',
      JSON.stringify(this.gd.caregiverToEdit)) : null;
    const groupIdToEdit = this.gd.groupIdToEdit ? sessionStorage.setItem('groupIdToEdit', JSON.stringify(this.gd.groupIdToEdit)) : null;
    const adminIdToEdit = this.gd.adminIdToEdit ? sessionStorage.setItem('adminIdToEdit', JSON.stringify(this.gd.adminIdToEdit)) : null;
    const subOperatorIdToEdit = this.gd.subOperatorIdToEdit ?
      sessionStorage.setItem('subOperatorIdToEdit', JSON.stringify(this.gd.subOperatorIdToEdit)) : null;
    const surveyIdToEdit = this.gd.surveyIdToEdit ? sessionStorage.setItem('surveyIdToEdit', JSON.stringify(this.gd.surveyIdToEdit)) : null;
    const responseIdToEdit = this.gd.responseIdToEdit ?
      sessionStorage.setItem('responseIdToEdit', JSON.stringify(this.gd.responseIdToEdit)) : null;
    const responseSurveyNameToEdit = this.gd.responseSurveyNameToEdit ?
      sessionStorage.setItem('responseSurveyNameToEdit', JSON.stringify(this.gd.responseSurveyNameToEdit)) : null;
    const responseSurveyDescriptionToEdit = this.gd.responseSurveyDescriptionToEdit ?
      sessionStorage.setItem('responseSurveyDescriptionToEdit', JSON.stringify(this.gd.responseSurveyDescriptionToEdit)) : null;
    return true;
  }
  ngOnInit() {
    // this.initialize();
    // this.getLogo();
  }

  initialize() {
    try {
      if (sessionStorage.getItem('currentUser')) {
        const localData = sessionStorage.getItem('currentUser');
        this.gd.userIdToEdit = JSON.parse(sessionStorage.getItem('userIdtoEdit'));
        this.gd.groupIdToEdit = JSON.parse(sessionStorage.getItem('groupIdToEdit'));
        if (!!localData) {
          if (sessionStorage.getItem('currentSubOpConfig')) {
            this.gd.currentSubOpConfig = JSON.parse(sessionStorage.getItem('currentSubOpConfig'));
          }
          this.gd.changeId(+sessionStorage.getItem('tempId'));
          this.gd.currentUser = JSON.parse(localData);
          // this.gd.currentHospital = JSON.parse(sessionStorage.getItem('currentHospital'));
          this.gd.currentMenu = sessionStorage.getItem('currentMenu');
          this.gd.userIdToEdit = JSON.parse(sessionStorage.getItem('userIdtoEdit'));
          this.gd.doctorIdToEdit = JSON.parse(sessionStorage.getItem('doctorIdToEdit'));
          this.gd.caregiverToEdit = JSON.parse(sessionStorage.getItem('caregiverToEdit'));
          this.gd.adminIdToEdit = JSON.parse(sessionStorage.getItem('adminIdToEdit'));
          this.gd.responseIdToEdit = JSON.parse(sessionStorage.getItem('responseIdToEdit'));
          this.gd.surveyIdToEdit = JSON.parse(sessionStorage.getItem('surveyIdToEdit'));
          this.gd.responseSurveyNameToEdit = JSON.parse(sessionStorage.getItem('responseSurveyNameToEdit'));
          this.gd.responseSurveyDescriptionToEdit = JSON.parse(sessionStorage.getItem('responseSurveyDescriptionToEdit'));
          this.gd.subOperatorIdToEdit = JSON.parse(sessionStorage.getItem('subOperatorIdToEdit'));
          // this.menuClick(this.gd.currentMenu);
          sessionStorage.removeItem('tempId');
          sessionStorage.removeItem('userIdtoEdit');
          sessionStorage.removeItem('doctorIdToEdit');
          sessionStorage.removeItem('groupIdToEdit');
          sessionStorage.removeItem('caregiverToEdit');
          sessionStorage.removeItem('adminIdToEdit');
          sessionStorage.removeItem('currentUser');
          sessionStorage.removeItem('currentHospital');
          sessionStorage.removeItem('currentMenu');
          sessionStorage.removeItem('subOperatorIdToEdit');
          sessionStorage.removeItem('surveyIdToEdit');
          sessionStorage.removeItem('responseIdToEdit');
          sessionStorage.removeItem('responseSurveyNameToEdit');
          sessionStorage.removeItem('responseSurveyDescriptionToEdit');
          sessionStorage.removeItem('currentSubOpConfig');
          const favIcon = document.head.querySelector('#favicon');
          const favIconurl = this.gd.currentUser.favIcon || favIcon.getAttribute('href');
          (favIcon as any).href = favIconurl;
          this.profileImage = this.gd.currentUser.subOperatorLogo || 'assets/images/colife-logo-symbol.png';
        }
      }
      this.hospitalName = this.gd.currentHospital.hospitalName;
      this.currentUSer = this.gd.currentUser.name;
      this.currentUserName = this.gd.currentSubOpConfig.name;
      this.loggedInUser = this.gd.currentUser['username'].toString();
      this.hosName = this.gd.currentHospital['hospitalName'];
    } catch (e) {
    }
    if (this.gd.currentUser) {
      this.profileImage = this.gd.currentUser.subOperatorLogo || 'assets/images/colife-logo-symbol.png';

    }
    this.loginService.getUserDetails(this.gd.currentUser.userID).subscribe(response => {
      // const hospitalID = response.user.hospital.id.toString();
      // const hospitalName = response.user.hospital.name;
      // this.gd.currentUser.name = response.user.name;
      this.gd.currentSubOpConfig = response.response;
      this.currentUserName = this.gd.currentSubOpConfig.name;


      // const hospitalAppConfigID = !!response.user.hospital.hospitalAppConfig ? response.user.hospital.hospitalAppConfig.id : null;
      // this.gd.currentHospital = new Hospital(hospitalName, hospitalID, hospitalAppConfigID);
    });
  }
  getLogo() {
    this.loginService.getLogo().subscribe(res => {
      if (res.projectStatusCode === 'S1001') {
        this.gd.currentUser.subOperatorLogo = res.response.logo;
        this.profileImage = res.response.logo;
      }
    });
  }

  navBtnClickEvent($event) {
    const st = new sideBtnClick($event);
  }

  logout() {
    const dialogOpts = { title: 'Confirm Dialog', message: 'Are you sure you want to logout ?' };
    this.confirmDialogService.openDialogModal(dialogOpts)
      .subscribe(res => {
        if (res) {
          this.loginService.logout()
            .subscribe(result => {
              if (result === true) {
                sessionStorage.clear();
                this.gd.reset();
                this.router.navigate(['/login']);

              } else {
              }
            });
        }

      });
  }
  public changePass(event) {
    this.renderer.removeClass(this.appSettingsRef.nativeElement, 'active');
    this.renderer.addClass(event.target, 'active');

  }

  getFilename(event) {
    const file: File = event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      $('#imageSet').attr('src', this.result);
    };
    myReader.readAsDataURL(file);
  }
  ngOnDestroy() {
    sessionStorage.removeItem('currentMenu');
  }

}
