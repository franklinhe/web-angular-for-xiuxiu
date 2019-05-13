import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AppComponent } from './app.component';

/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { MessageModule } from 'src/shared/message/Message.module';
import { ModalModule } from 'src/shared/modal/Modal.module';
import { HttpService } from './service/http.service';
import { ScrollbarModule } from 'src/shared/scrollbar/scrollbar.module';
import { HttpInterceptorModule } from 'src/shared/http-api/http-interceptor.module';
import { SearchComponent } from './search/search.component';
import { CaseContentComponent } from './case-content/case-content.component';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    CaseContentComponent
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
        path: 'search',
        component: SearchComponent
      },{
        path: 'case',
        component: CaseContentComponent
      },{
        path: '**',
        pathMatch: 'full',
        redirectTo: '/search'
      }
    ]
    // , { useHash: true }
    ),
    ScrollbarModule,
    HttpInterceptorModule
  ],
  bootstrap: [ AppComponent ],
  /** 配置 ng-zorro-antd 国际化（文案 及 日期） **/
  providers   : [
    { provide: NZ_I18N, useValue: zh_CN },
    HttpService
  ]
})
export class AppModule { }