import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from './configuration.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from '../custom-validators/CustomValidators';
import { rangeLength } from '../shared/custom-validator/range-length';
import { TimeOffset } from '../model/time-offset';
import { LoginService } from '../login/login.service';
import { ConfirmModalService } from '../core/confirm-modal/confirm-modal.service';
import { GlobalDataService } from '../core/services/global-data.service';
import { Router } from '@angular/router';
import { CountryList } from 'src/app/model/country-list';
import { CurrencyList } from 'src/app/model/currencyList';
import { LanguagesList } from 'src/app/model/languages';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  color = 'accent';
  LogMonitorChecked: boolean;
  pwrBichecked: boolean;
  configForm: FormGroup;
  countryList = CountryList;
  currencyList = CurrencyList;
  languageList = LanguagesList;
  timeOffset = TimeOffset.map(e => ({ text: e.name, id: e.offset }));
  startDate: any;
  isEditing: boolean;
  logoImg: any;
  constructor(
    private router: Router,
    private gd: GlobalDataService,
    private confirmDialogService: ConfirmModalService,
    private loginService: LoginService,

    private configService: ConfigurationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.configForm = this.fb.group({
      userName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        rangeLength(3, 50),
        CustomValidators.nameValidation(),
        CustomValidators.isFirstLetter()
      ])],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        rangeLength(3, 50),
        CustomValidators.nameValidation(),
        CustomValidators.isFirstLetter()
      ])],
      uvtPwd: ['', Validators.compose([
        Validators.required,
        CustomValidators.passwordValidation(),
        Validators.minLength(8),
        Validators.maxLength(15)
      ])],
      subOperatorName: ['', Validators.required],
      operatorIP: ['', Validators.compose([
        Validators.required,
        CustomValidators.IpValidation()
      ])],
      subOperatorIp: ['', Validators.compose([
        Validators.required,
        CustomValidators.IpValidation()
      ])],
      diskID: ['', ''],
      processorID: ['', ''],
      location: [[], Validators.required],
      logo: ['', ''],
      currency: [[], Validators.required],
      language: [[], Validators.required],
      powerBIStatus: [false, ''],
      logMonitorStatus: [false, ''],
      accessKey: ['', ''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      paymentSecret: ['', ''],
      phoneNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      startBillDate: ['', ''],
      billDay: ['', ''],
      packageName: ['', ''],
      packagePrice: ['', ''],
      expiryWarningMailDay: ['', ''],
      licenseKey: ['', ''],
    });
  }

  ngOnInit() {
    this.isEditing = false;
    this.LogMonitorChecked = false;
    this.pwrBichecked = false;
    this.getConfig();
  }
  getConfig() {
    this.configService.getConf().subscribe(res => {
      console.log(res);
      if (res.response.projectStatusCode !== 'E1110') {
        this.isEditing = true;
        this.startDate = res.response.startDate;
        this.LogMonitorChecked = res.response.logMonitor;
        this.pwrBichecked = res.response.powerBiConnection;
        this.setConfForm(res.response);
        // this.configForm.controls.userName.disable();
        // this.configForm.controls.uvtPwd.disable();
      }
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err.error);
          this.toastr.warning('Error in connection');
        }
      });
  }
  setConfForm(data) {
    console.log(data);

    this.configForm.patchValue({
      userName: '',
      uvtPwd: '',
      subOperatorName: data.name,
      operatorIP: data.operatorIp,
      subOperatorIp: data.subOperatorIp,
      email: data.email,
      diskID: data.diskId,
      processorID: data.processorId,
      location: [{ text: data.location, id: data.location }],
      currency: [{ text: data.currency, id: data.currency }],
      language: [{ text: data.language, id: data.language }],
      powerBIStatus: data.powerBiConnection,
      logMonitorStatus: data.logMonitor,
      accessKey: data.accessKey,
      paymentSecret: data.paymentSecret,
      phoneNumber: data.phone,
      billDay: data.billingDay,
      startDate: this.startDate,
      packagePrice: data.packagePrice,
      packageName: data.packageName,
      licenseKey: data.licenseKey
    });
  }

  // onChangeToggle(params) {
  //   if (params === 'LogMonitorChecked') {
  //     this.LogMonitorChecked = !this.LogMonitorChecked;
  //   } else {
  //     this.pwrBichecked = !this.pwrBichecked;
  //   }
  // }
  submitForm() {
    if (this.configForm.invalid) {
      this.toastr.info('Please check fields !', '', {
        timeOut: 3000
      });
      // this.notify.openSnackBar('Please check fields !', '');
      return;
    }
    if (this.isEditing) {
      this.uploadData();
      // this.editData();
    } else {
      this.uploadData();
    }
  }

  uploadData() {
    (!!this.startDate) ? this.startDate = this.startDate : this.startDate = new Date().toISOString();
    console.log(this.startDate);

    const data = {
      username: this.configForm.value.userName,
      password: this.configForm.value.uvtPwd,
      name: this.configForm.value.subOperatorName,
      operatorIp: this.configForm.value.operatorIP,
      subOperatorIp: this.configForm.value.subOperatorIp,
      email: this.configForm.value.email,
      diskId: this.configForm.value.diskID,
      processorId: this.configForm.value.processorID,
      location: this.configForm.value.location[0].text,
      currency: this.configForm.value.currency[0].text,
      language: this.configForm.value.language[0].text,
      powerBiConnection: this.configForm.value.powerBIStatus,
      logMonitor: this.configForm.value.logMonitorStatus,
      accessKey: this.configForm.value.accessKey,
      paymentSecret: this.configForm.value.paymentSecret,
      phone: this.configForm.value.phoneNumber,
      // startDate: new Date().toISOString(),
      startDate: this.startDate,
      billingDay: this.configForm.value.billDay,
      packageName: this.configForm.value.packageName,
      packagePrice: this.configForm.value.packagePrice,
      expiryWarningMailDay: +this.configForm.value.expiryWarningMailDay,
      licenseKey: this.configForm.value.licenseKey
      // utcOffset: this.configForm.value.timeZone.id,
    };
    console.log(data);

    // if (this.configForm.invalid) {
    //   this.toastr.error('Invalid Form', '', {
    //     timeOut: 3000
    //   });
    //   return;
    // }
    // const formData = new FormData();
    // console.log(this.configForm.get('logo').value);
    // formData.append('file', this.configForm.get('logo').value);
    this.configService.uploadData(data).subscribe(res => {
      console.log(res);
      this.toastr.success('Completed Successfully', '', {
        timeOut: 3000
      });
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err.error);
          this.toastr.warning('Error in connection');
        }
      });
  }

  editData() {
    (!!this.startDate) ? this.startDate = this.startDate : this.startDate = new Date().toISOString();
    console.log(this.startDate);

    const data = {
      name: this.configForm.value.subOperatorName,
      operatorIp: this.configForm.value.operatorIP,
      subOperatorIp: this.configForm.value.subOperatorIp,
      email: this.configForm.value.email,
      diskId: this.configForm.value.diskID,
      processorId: this.configForm.value.processorID,
      location: this.configForm.value.location[0].text,
      currency: this.configForm.value.currency[0].text,
      language: this.configForm.value.language[0].text,
      powerBiConnection: this.configForm.value.powerBIStatus,
      logMonitor: this.configForm.value.logMonitorStatus,
      accessKey: this.configForm.value.accessKey,
      paymentSecret: this.configForm.value.paymentSecret,
      phone: this.configForm.value.phoneNumber,
      // startDate: new Date().toISOString(),
      startDate: this.startDate,
      billingDay: this.configForm.value.billDay,
      packageName: this.configForm.value.packageName,
      packagePrice: this.configForm.value.packagePrice,
      expiryWarningMailDay: +this.configForm.value.expiryWarningMailDay,
      licenseKey: this.configForm.value.licenseKey

      // utcOffset: this.configForm.value.timeZone.id,
    };
    console.log(data);

    // if (this.configForm.invalid) {
    //   this.toastr.error('Invalid Form', '', {
    //     timeOut: 3000
    //   });
    //   return;
    // }
    // const formData = new FormData();
    // console.log(this.configForm.get('logo').value);
    // formData.append('file', this.configForm.get('logo').value);
    this.configService.uploadData(data).subscribe(res => {
      console.log(res);
      this.toastr.success('Completed Successfully', '', {
        timeOut: 3000
      });
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err.error);
          this.toastr.warning('Error in connection');
        }
      });
  }

  get confForm() { return this.configForm.controls; }
  getImage(e) {
    console.log(e);
    this.logoImg = e.target.files[0];
  }
  uploadImg() {
    if (!this.logoImg) {
      this.toastr.warning('Select an Image', '', {
        timeOut: 3000
      });
      return;
    }
    const formData = new FormData();
    formData.append('logo', this.logoImg);

    this.configService.uploadImg(formData).subscribe(res => {
      console.log(res);
      if (res.projectStatusCode === 'S1001') {
        this.toastr.success('Logo uploaded Successfully', '', {
          timeOut: 3000
        });
        // window.location.reload();
      }
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err.error);
          this.toastr.warning('Error in connection');
        }
      });
  }
  logout() {
    console.log('Logged out');

    const dialogOpts = { title: 'Confirm Dialog', message: 'Are you sure you want to logout ?' };
    this.confirmDialogService.openDialogModal(dialogOpts)
      .subscribe(res => {
        if (res) {
          this.configService.logout().subscribe(result => {
            console.log(result);
            // if (result === true) {
            //   sessionStorage.clear();
            //   this.gd.reset();
            //   this.router.navigate(['/login']);
            // }
            if (result === 'S1026') {
              sessionStorage.clear();
              this.gd.reset();
              this.router.navigate(['/login']);
            }
          });
        }
      });
  }
}
