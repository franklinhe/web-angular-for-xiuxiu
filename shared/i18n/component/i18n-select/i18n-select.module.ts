import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ChangeLanguageComponent} from './change-language.component';

@NgModule({
  declarations: [
    ChangeLanguageComponent
  ],
  imports: [
    NgZorroAntdModule,
    TranslateModule
  ],
  exports: [
    ChangeLanguageComponent,
  ],
})
export class I18nSelectModule {
}
