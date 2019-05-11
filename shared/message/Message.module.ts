import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgZorroAntdModule, NZ_MESSAGE_CONFIG} from 'ng-zorro-antd';
import {MessageService} from './message.service';

@NgModule({
  imports: [
    NgZorroAntdModule
  ]
})
export class MessageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MessageModule,
      providers: [
        { provide: NZ_MESSAGE_CONFIG, useValue: {
          nzDuration: 3000,
          nzMaxStack: 7,
          nzPauseOnHover: true,
          nzAnimate: true,
          nzTop: 100
        }},
        MessageService,
      ]
    };
  }
}
