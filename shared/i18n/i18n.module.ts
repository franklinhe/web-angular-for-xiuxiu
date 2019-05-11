import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {I18nService} from './i18n.service';
import {environment} from '../../environments/environment';

export function createTranslateHttpLoader(http: any) { // HttpClient
  return new TranslateHttpLoader(http, environment.resource + 'assets/i18n/', '.json');
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [/* DONT ADD HERE */],
})
export class I18nForRootModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: I18nForRootModule,
      providers: [
        I18nService
      ]
    };
  }
}

@NgModule({
  imports: [
    TranslateModule
  ],
  providers: [/* DONT ADD HERE */],
  exports: [
    TranslateModule
  ],
})
export class I18nForChildModule {
  static forChild(): ModuleWithProviders {
    return {
      ngModule: I18nForChildModule,
      providers: []
    };
  }
}
