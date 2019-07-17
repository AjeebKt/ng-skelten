import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { throwError as observableThrowError, } from 'rxjs';
import { tap, catchError, finalize, filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { ProgressBarService } from './progress-bar.service';
import { GlobalDataService } from './global-data.service';
import { AuthService } from './auth.service';
import { SnackBarService } from './snack-bar.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    previousUrl: string;
    constructor(private router: Router, private progressbarService: ProgressBarService,
        private snackBarSerivce: SnackBarService,
        private globalDataService: GlobalDataService, private authService: AuthService) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            this.previousUrl = event.url;
        });
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            finalize(() => {
                this.progressbarService.display(false);
            }),
            tap(event => {
                if (event instanceof HttpResponse) {
                    const response = <any>event.body;
                }
            }),
            catchError((error: any, caught: Observable<any>): Observable<ErrorResponse | HttpErrorResponse> => {
                const message = error.error ? (error.error.response || error.error.error_description) : error.error.error_description;
                const response = error.error ? error.error : error.error.error_description;

                if (error instanceof HttpErrorResponse && error.status === 200) {
                    return observableThrowError(error);
                }
                if (error instanceof HttpErrorResponse && error.status === 400) {
                    const isRfereshTokenError = error.error && error.error.error === 'invalid_grant';
                    const isRefreshTokenExpired = isRfereshTokenError && error.error.error_description.includes('Invalid refresh token');
                    if (isRefreshTokenExpired) {
                        this.snackBarSerivce.openSnackBar('Session Expired', '');
                        this.globalDataService.reset();
                        this.router.navigate(['/login']);
                    }
                    return observableThrowError(new ErrorResponse(message, error.ok, error.status, error.statusText, response));
                }
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    const isTokenError = error.error && error.error.error === 'invalid_token';
                    if (isTokenError) {
                        this.snackBarSerivce.openSnackBar('Session Expired', '');
                        this.globalDataService.reset();
                        this.router.navigate(['/login']);
                    }
                    return observableThrowError(error);
                }
                if (error instanceof HttpErrorResponse && error.status === 403) {
                    return observableThrowError(error);
                }
                if (error instanceof HttpErrorResponse && error.status === 404) {
                    // tslint:disable-next-line:max-line-length
                    return observableThrowError(new ErrorResponse(error.error.response, error.ok, error.status, error.statusText, response));
                }
                if (error instanceof HttpErrorResponse && error.message === 'Http failure response for (unknown url): 0 Unknown Error') {

                    if (error.status === 0) {
                        sessionStorage.clear();

                    } else {
                        sessionStorage.clear();
                    }
                }
                // console.clear();
                return observableThrowError(new ErrorResponse(message, error.ok, error.status, error.statusText, response));
            }));
    }
    handle401TokenError(error: HttpErrorResponse) {
        const isError = error.error && error.error.error === 'invalid_token';
        const isRfereshTokenError = error.error && error.error.error === 'invalid_grant';
        const isTokenExpired = isError && error.error.error_description.includes('Invalid access token:');
        const isInvalidToken = isError && error.error.error_description.includes('Access token expired:');
        const isRefreshTokenExpired = (isError || isRfereshTokenError)
            && error.error.error_description.includes('Invalid refresh token');
        if (isInvalidToken || isTokenExpired) {
            this.authService.refreshToken(this.globalDataService.currentUser.refreshToken).subscribe((authRes) => {
                this.globalDataService.currentUser.refreshToken = authRes.refresh_token;
                this.globalDataService.currentUser.token = authRes.access_token;
                // this.router.navigate([this.previousUrl]);
                window.location.reload();
            });
        }
        if (isRefreshTokenExpired) {
            this.globalDataService.reset();
            this.router.navigate(['/login']);
        }
        if (error.error && error.error.error_description) {
            return observableThrowError(new ErrorResponse(error.error.error_description, error.ok,
                error.status, error.statusText, error.error));
        }

        sessionStorage.clear();
        this.globalDataService.reset();
        this.router.navigate(['/login']);
        return observableThrowError(error);
    }
}
export class ErrorResponse {
    constructor(public message: string,
        public ok: boolean,
        public status: number,
        public statusText: string,
        public response: any) { }

}
