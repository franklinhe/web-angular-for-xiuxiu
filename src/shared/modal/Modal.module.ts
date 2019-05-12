import {NgModule, ModuleWithProviders} from '@angular/core';
import {ModalService} from './modal.service';

@NgModule({})
export class ModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [
        ModalService
      ]
    };
  }
}
