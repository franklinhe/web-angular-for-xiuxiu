import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {I18nForChildModule} from './i18n/i18n.module';
import {ScrollbarModule} from './scrollbar/scrollbar.module';
import {HttpInterceptorModule} from './http-api/http-interceptor.module';

@NgModule({
  declarations: [],
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    // I18nForChildModule,
    HttpInterceptorModule,
    ScrollbarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    // I18nForChildModule,
    HttpInterceptorModule,
    ScrollbarModule
  ]
})
export class SharedModule {
}
