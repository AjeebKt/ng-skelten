import { Hospital } from '../../model/user-detail';

export class Patient {
    id: number;
    userId: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    height: number;
    weight: number;
    createdAt: Date;
    blocked: boolean;
    opip: string;
    email: string;
    contactNumber: string;
    address1: string;
    address2: string;
    location: string;
    listOfDoctors: Doctor[];
    listOfNurses: Caregiver[];
    diabetic: boolean;
    subOperatorId: number;
    acceptConsentForm: boolean;
    proxyUserId: number;
    selected = false;
}
export class Doctor {
    id: number;
    username: string;
    userId: number;
    name: string;
    contactNumber: number;
    email: string;
    enabled: boolean;
    masked: boolean;
    hospital: Hospital;
    moreUserInfo: MoreUserInfo;
    authorities: Authorities;
    selected: boolean;

}
export class MoreUserInfo {
    id: number;
    specialization: string;
    age: number;
    gender: string;
    dateOfBirth: string;
    startDate: number;
}
export class Authorities {
    name: string;
}

export class Caregiver {
    id: number;
    username: string;
    userId: number;
    name: string;
    contactNumber: number;
    email: string;
    enabled: boolean;
    masked: boolean;
    hospital: Hospital;
    moreUserInfo: MoreUserInfo;
    onlineStatus: boolean;
    authorities: Authorities;
    selected: boolean;
}
export class NewPatientResponse {
    response: string;
    id: string;
    createdAt: number;
    otherInfo: string;
    listOfDocters: Doctor[];
    listOfNurses: Caregiver[];
    patientStatus: string;
    imageId: string;
    imageStatus: string;
}
export class AllPatientsforthisDoctorandNurseResponse {
    listOfFavouritedPatients: AllPatientDocNurseResponse[];
    listOfNonFavouritedPatients: AllPatientDocNurseResponse[];
}
export class AllPatientDocNurseResponse {
    id: number;
    userId: string;
    gNineId: string;
    firstName: string;
    lastName: string;
    employeeid: number;
    corporaterName: string;
    corporateId: number;
    plan: string;
    proxyUserId: number;
    name: string;
    dateOfBirth: string;
    gender: string;
    height: number;
    weight: number;
    createdAt: number;
    blocked: boolean;
    opip: string;
    email: string;
    contactNumber: string;
    address1: string;
    address2: string;
    location: string;
    listOfDoctors: Doctor[];
    listOfNurses: Caregiver[];
    diabetic: boolean;
    subOperatorId: number;
    acceptConsentForm: boolean;
    packageName: string;
    selected = false;
    androidVersion: string;
    iosVersion: string;
    groupId: number;
    mask: boolean;
}
