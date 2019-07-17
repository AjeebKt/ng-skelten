import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CurrentUser } from 'src/app/model/current-user';
import { Hospital } from 'src/app/model/hospital';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  currentSubOpConfig: any;
  currentUser: CurrentUser = new CurrentUser();
  currentHospital: Hospital = new Hospital();
  selectedUserId;
  addPackages: any;
  packageId;
  currentMenu: string;
  tempId;
  roleStatus: any;
  doctorIdToEdit: { id: number, page: number };
  caregiverToEdit: { id: number, page: number };
  userIdToEdit: { id: number, page: number };
  groupIdToEdit: { id: number, page: number };
  adminIdToEdit: { id: number, page: number };
  surveyIdToEdit: { id: string, page: number };
  responseIdToEdit: { id: number, page: number };
  responseSurveyNameToEdit: string;
  responseSurveyDescriptionToEdit: string;
  subOperatorIdToEdit: { id: number, page: number };
  private userIdPatient = new BehaviorSubject(null);
  currentuserIdPatient = this.userIdPatient.asObservable();
  focusChange = new Subject();
  constructor() { }
  reset() {

    this.currentUser = new CurrentUser();
    this.currentHospital = new Hospital();
    this.selectedUserId = {};
    this.addPackages = false;
    this.roleStatus = false;

  }
  changeId(id: number) {
    this.tempId = id;
    this.userIdPatient.next(id);
  }
}
