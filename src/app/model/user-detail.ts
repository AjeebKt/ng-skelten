export class UserDetail {
    user: User;
    listOfFavouritedPatients: any[];
    listOfNonFavouritedPatients: any[];
    lastLoginDateTime: Number;
    isLastOrCurrent: string;
}
export class User {
    id: Number;
    username: string;
    userId: string;
    name: string;
    contactNumber: string;
    email: string;
    enabled: boolean;
    masked: boolean;
    authorities: [{ name: string }];
    onlineStatus: boolean;
    hospital: Hospital;
}
export class Hospital {
    id: Number;
    userId: string;
    entityId: string;
    name: string;
    email: string;
    contactNumber: string;
    location: string;
    blocked: boolean;
    smsHeader: string;
    chatHeader: string;
    createdAt: string;
    hospitalAppConfig: any;
    tearmsAndConditons: any;
    numOfCorporateCustomers: any;
    numOfUsers: any;
    numOfSubOperators: any;
    numOfServices: any;
    hospitalConfig: HospitalConfig;
}
export class HospitalConfig {
    id: Number;
    entityEnable: boolean;
    paymentEnable: boolean;
    videoEnable: boolean;
    chatAppEnable: boolean;
    smsAppEnable: boolean;
    backupPeriod: string;
    freeTrial: boolean;
    postPaid: boolean;
    createdAt: string;
    billDate: string;
    paymentDate: string;
    freeTrialExpiry: string;
}
