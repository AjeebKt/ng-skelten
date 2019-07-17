import { Hospital } from '../../model/user-detail';
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
export class AddDoctorResponse {
    id: number;
    response: string;
    createdAt: number;
    userStatus: string;
}
