import {Component, OnInit} from '@angular/core';
import {I18nService} from '../../i18n.service';

const langMap = {
  zh: '简体中文', // translateService
  en: 'English'
};

@Component({
  selector: 'qk-change-language',
  templateUrl: './change-language.component.html'
})
export class ChangeLanguageComponent implements OnInit {
  currentLangStr;

  constructor(
    private i18nService: I18nService,
  ) {
  }

  ngOnInit() {
    this.currentLangStr = langMap[this.i18nService.getLng()];
  }

  changeLang(lng: string) {
    // 设置为已经改变了语言
    this.i18nService.setLng(lng);
    this.currentLangStr = langMap[lng];
  }
}
