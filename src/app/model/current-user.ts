import { LoginResponse } from './login-response';
import { TrustedString } from '@angular/core/src/sanitization/bypass';

export class CurrentUser {
  userID: string;
  name: string;
  token: string;
  username: string;
  lastLogin: string;
  role: string;
  userData: any;
  operatorID: string;
  refreshToken: string;
  logintTime: number;
  expiresIn: number;
  subOperatorLogo: string;
  favIcon: string;
  constructor(loginResponse = new LoginResponse()) {
    this.userID = loginResponse.id;
    this.token = loginResponse.token;
    this.role = loginResponse.role;
    this.operatorID = loginResponse.subOperatorId;
  }
  setAllFields(loginResponse = new LoginResponse()) {
    this.userID = loginResponse.id;
    this.token = loginResponse.token;
    this.role = loginResponse.role;
    this.operatorID = loginResponse.subOperatorId;
  }
}
