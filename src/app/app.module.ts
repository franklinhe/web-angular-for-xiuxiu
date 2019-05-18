import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {AppComponent} from './app.component';

/** 配置 angular i18n **/
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {MessageModule} from '../shared/message/Message.module';
import {ModalModule} from '../shared/modal/Modal.module';
import {HttpService} from './service/http.service';
import {ScrollbarModule} from '../shared/scrollbar/scrollbar.module';
import {HttpInterceptorModule} from '../shared/http-api/http-interceptor.module';
import {SearchResultComponent} from './search-result/search-result.component';
import {SearchTypeComponent} from './search-type/search-type.component';
import {SearchInputComponent} from './search-input/search-input.component';
import {AppSearchTypeComponent} from './app-search-type/app-search-type.component';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    SearchTypeComponent,
    SearchInputComponent,
    AppSearchTypeComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    /** 导入 ng-zorro-antd 模块 **/
    NgZorroAntdModule,
    MessageModule.forRoot(),
    ModalModule.forRoot(),
    NgZorroAntdModule,
    RouterModule.forRoot([
        {
          path: 'type',
          component: AppSearchTypeComponent
        }, {
          path: '**',
          pathMatch: 'full',
          redirectTo: '/type'
        }
      ]
      , { useHash: true }
    ),
    ScrollbarModule,
    HttpInterceptorModule
  ],
  bootstrap: [AppComponent],
  /** 配置 ng-zorro-antd 国际化（文案 及 日期） **/
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    HttpService
  ]
})
export class AppModule {
}
