export interface IUser {
    id: number;
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
}

export class User implements IUser {
    constructor(
        public id: number,
        public name: string,
        public dateOfBirth: string,
        public gender: string,
        public height: number,
        public weight: number,
        public createdAt: Date,
        public blocked: boolean,
        public opip: string,
        public email: string,
        public contactNumber: string) { }
}
