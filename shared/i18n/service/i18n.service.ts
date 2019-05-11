import {EventEmitter, Injectable} from '@angular/core';
import {en_US, NzI18nService, zh_CN} from 'ng-zorro-antd';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';

export const lngKey = '__lng__';

@Injectable()
export class I18nService {
  readonly defaultLng = environment.lng;
  lng: any;
  lngChangeEvent = new EventEmitter();

  constructor(
    private translateService: TranslateService,
    private nzLocalService: NzI18nService,
  ) {
    this.setLng(this.getLng());
  }

  setLng(lng?, needReload = true) {
    localStorage.setItem(lngKey, lng || this.defaultLng);
    this.translateService.use(lng);
    this.lng = lng;
    this.lngChangeEvent.emit(this.lng);
    let local = zh_CN;
    if (lng === 'zh') {
      local = zh_CN;
    } else if (lng === 'en') {
      local = en_US;
    }
    this.nzLocalService.setLocale(local);
  }

  getLng() {
    let lng = localStorage.getItem(lngKey);
    if (!lng) {
      lng = this.defaultLng;
      this.setLng(lng);
    }
    return lng;
  }
}
