import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
// import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class MessageService {
  option = {
    nzDuration: 3000,
    nzMaxStack: 7,
    nzPauseOnHover: true,
    nzAnimate: true
  };

  constructor(private messageService: NzMessageService,
              // private translateService: TranslateService,
  ) {
  }

  loading(content: string, options: any = this.option) {
    this.create('info', content, options);
  }

  success(content: string, options: any = this.option) {
    this.create('success', content, options);
  }

  error(content: string, options: any = this.option) {
    this.create('error', content, options);
  }

  warning(content: string, options: any = this.option) {
    this.create('warning', content, options);
  }

  info(content: string, options: any = this.option) {
    this.create('info', content, options);
  }

  html(content: string, options: any = this.option) {
    this.create('html', content, options);
  }

  private create(method, content, options) {
    this.messageService[method](content, options);
    // this.messageService[method](this.translateService.instant(content), options);
  }
}
