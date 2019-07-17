import { Patient, Doctor, Caregiver } from './patient';

export class EditUserResponse {
    patient: Patient;
    base64: string;
    listOfDoctors: Doctor[];
    listOfNurses: Caregiver[];
    grandAlertForPatient: number;
    grandChatMessagesForPatient: number;
    grandAlertBoarderLineChatMessagesForPatient: number;
    userName: string;
    guardianStatus: boolean;
}
