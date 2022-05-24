import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrHelper } from '../helpers/toastr.helper';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AdminAuthService } from '../services/admin.auth.service';

@Injectable()
export class AdminErrorInterceptor implements HttpInterceptor {
    constructor(public authen: AdminAuthService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let url = req?.url?.toLowerCase(),
            admin = url?.indexOf('/admin/') >= 0;
        return next.handle(req).pipe(
            tap(),
            catchError((err: any) => {
                if (admin) {
                    switch (err.status) {
                        case 404:
                            ToastrHelper.Error('No data found');
                            return;
                        case 401:
                            ToastrHelper.Error('Login session expires!');
                            this.authen.logout();
                            break;
                        case 500:
                            ToastrHelper.Error('System error, please contact Admin');
                            console.log(err);
                            break;
                        case 503:
                            let end = url.indexOf('?'),
                                start = url.toLowerCase().indexOf('admin/') + 6,                                
                                name = end > start ? url.substring(start, end) : url.substring(start);
                            return throwError('You don\'t have permission to access: ' + name);
                        default:
                            return throwError(err);
                    }
                }
            }));
    }
}
