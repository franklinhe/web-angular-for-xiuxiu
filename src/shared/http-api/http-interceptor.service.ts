import {Injectable, Injector} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {tap, catchError, timeout} from 'rxjs/operators';
import {MessageService} from '../message/message.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
// import {TranslateService} from '@ngx-translate/core';
// import {backoff} from './backoff';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
              private message: MessageService,
              private notification: NzNotificationService,
              // private translateService: TranslateService,
              private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      return next.handle(req)
    }
    const authReq = req.clone({});
    return next
      .handle(authReq)
      .pipe(
        timeout(20000),
        catchError((err, caught) => {
          if (err.status === 0) {
            this.message.error('网络不在线！');
            // cancel request
            return of(new HttpResponse());
          } else if (err.name === 'TimeoutError') {
            // retry
            return caught;
          }
          // cancel request
          // return of(new HttpResponse());
          return err;
        })
      )
      // .pipe(backoff(3, 250))
      .pipe(tap((res: HttpResponse<any>) => {
        return of(res);
      }, (error: HttpErrorResponse) => {
        this.message.warning('维护中（暂不可用）。。。！');
        if (!environment.production) {
          this.notification.warning(error.status + '(开发模式下显示): ' + authReq.url, error.error.message, {nzDuration: 0});
        }
      }));
  }
}

