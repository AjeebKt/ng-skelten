export class Group {
  adminName: string;
  block: boolean;
  contactNumber: string;
  email: string;
  groupName: string;
  id: number;
  location: string;
  operatorId: number;
  patients: Patient[];
  subOperatorId: number;
  userId: string;
  tabledetails: string;
  selected?: boolean;
  numberselected: number;
}
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
  selected = false;
  // listOfDoctors: ListOfDoctors;
  // listOfNurses: ListOfNurses;
  diabetic: boolean;
  subOperatorId: number;
  acceptConsentForm: boolean;
  proxyUserId: number;

}
