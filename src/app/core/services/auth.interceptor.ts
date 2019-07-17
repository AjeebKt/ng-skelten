import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalDataService } from './global-data.service';
import { environment } from '../../../environments/environment';
import { CurrentUser } from '../../model/current-user';
import { ProgressBarService } from './progress-bar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private globalDataService: GlobalDataService, private progressbarService: ProgressBarService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        headers = headers.set('Authorization', 'Basic ' + btoa('citta' + ':' + 'citta'));
        const apiUrl = environment.API.URL + req.urlWithParams;

        const user: CurrentUser = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null;
        const loggedUser = this.globalDataService.currentUser || user;
        let token = !!loggedUser && loggedUser.token ? loggedUser.token : null;
        // console.log(req.url);
        // tslint:disable-next-line:max-line-length
        // token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJfaWQiOjMsInVzZXJfbmFtZSI6InNhcmFuIiwic2NvcGUiOlsib3BlbmlkIl0sImV4cCI6MTU2MTcxOTIxMSwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJqdGkiOiI4NGJjMGExZS0zZWNjLTQxMmUtYWNlMi00MmJmYjY3NTdjMGYiLCJjbGllbnRfaWQiOiJjaXR0YSJ9.TzzdBhmh0nhRDtnouBU8XMUDzGYbuZgL-qYBHENC69H312klHHJDkDteAk5fX9qV8LenTxl7S_0qYiGVs6cCL_8rtHl9d6Fw5xkDpBnCuKhNUy4ypDNkdJ-vWTamcIqFct-apLaHM2_NQBLzDkdq7ApSvosVBjhDXx6htneQSKOpvSYhuwHDV4f7bn_l5T9u_hNwsu3xkTF7N35fqsXeHu_8XMgmhtAHiZ9SIeUR8t7kcwoYUBu26AxvQQNaU3abjoqG3XhPTGXL6MC_aSJ-AQvKpa_l4EJmmE86-5JhdCqZla7FIwN0bgfqjs3PfK2ZS2EDw6tWEB0bc2fjtpX7EQ';
        token = this.globalDataService.currentUser.token;

        if (!req.url.toLowerCase().includes('exist')) {
            this.progressbarService.display(true);
        }

        if (!!token && !req.url.includes('oauth/token')) {
            console.log('com on babeeee.............');

            let authHeader = new HttpHeaders();
            // console.log(, 'headers');
            authHeader = authHeader.append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + token.toString());
            authHeader = req.headers.has('Content-Type') ? authHeader.delete('Content-Type') : authHeader;
            const authReq = req.clone({ headers: authHeader, url: apiUrl });
            return next.handle(authReq);
        }

        const anonymousReq = req.clone({ url: apiUrl, headers: headers });
        // if (!this.progressbarService.getStatus()) {
        //  }
        return next.handle(anonymousReq);
    }
}
