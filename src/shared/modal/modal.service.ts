import {Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
// import {TranslateService} from '@ngx-translate/core';
// import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class ModalService {
  public modalCount = 2000;
  private nzOkText = '确定';
  private nzCancelText = '取消';
  option = {
    nzOkText: this.nzOkText,
    nzCancelText: this.nzCancelText,
    nzMaskClosable: false,
    nzZIndex: 2802
  };

  constructor(
    private nzModalService: NzModalService,
    // private i18n: I18nService,
    // private translateService: TranslateService,
  ) {
    // i18n.lngChangeEvent.subscribe(lng => {
    //   this.option.nzOkText = this.translateService.instant('确定');
    //   this.option.nzCancelText = this.translateService.instant('取消');
    // })
  }

  info(title: string, okFunction: any, content?: string): void {
    this.nzModalService.info({
      nzTitle: title,
      nzContent: content,
      nzOnOk: okFunction,
    });
  }

  success(title: string, okFunction: any, content?: string): void {
    this.nzModalService.success({
      nzTitle: title,
      nzContent: content,
      nzOnOk: okFunction,
    });
  }

  error(title: string, okFunction: any, content?: string): void {
    this.nzModalService.error({
      nzTitle: title,
      nzContent: content,
      nzOnOk: okFunction,
    });
  }

  warning(title: string, okFunction: any, content?: string): void {
    this.nzModalService.warning({
      nzTitle: title,
      nzContent: content,
      nzOnOk: okFunction,
      nzCancelText: this.option.nzCancelText
    });
  }

  confirmSave(okFunction: Function, content?: string) {
    this.popupConfirm('confirm_save', okFunction, content);
  }

  confirmCancel(okFunction: Function, content?: string) {
    this.popupConfirm('confirm_cancel', okFunction, content);
  }

  confirmLeave(okFunction: Function, content?: string) {
    this.popupConfirm('confirm_leave', okFunction, content);
  }

  confirm(options: any) {
    // this.option.nzOkText = this.translateService.instant('确定');
    // this.option.nzCancelText = this.translateService.instant('取消');
    this.nzModalService.confirm(Object.assign(this.option, options));
  }

  confirmDelete(okFunction: Function, content?: string) {
    this.popupConfirm('您确认要删除吗？', okFunction, content);
  }

  popupConfirm(title: string, okFunction: Function, content?: string) {
    let options: any = {nzOnOk: okFunction};
    // this.option.nzOkText = this.translateService.instant('确定');
    // this.option.nzCancelText = this.translateService.instant('取消');
    if (content) {
      options.nzContent = content;
    }
    this.nzModalService.confirm(Object.assign({
      nzTitle: title,
    }, this.option, options));
  }

  popupConfirm_(title: string, okFunction: Function, cancelFunction: Function, content?: string) {
    let options: any = {nzOnOk: okFunction, nzOnCancel: cancelFunction};
    // this.option.nzOkText = this.translateService.instant('确定');
    // this.option.nzCancelText = this.translateService.instant('取消');
    if (content) {
      options.nzContent = content;
    }
    this.nzModalService.confirm(Object.assign({
      // nzTitle: this.translateService.instant(title),
      nzTitle: title
    }, this.option, options));
  }
}
