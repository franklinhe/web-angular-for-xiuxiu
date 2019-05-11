import { NgModule } from '@angular/core';
import { UEditorModule } from 'ngx-ueditor';
import { UeditorComponent } from './ueditor.component';

@NgModule({
  declarations: [UeditorComponent],
  imports: [
    UEditorModule.forRoot({
      js: [
        `./assets/ueditor/ueditor.all.min.js`,
        `./assets/ueditor/ueditor.config.js`,
      ],
      // 默认前端配置项
      options: {
        UEDITOR_HOME_URL: './assets/ueditor/'
      }
    })
  ],
  exports: [
    UeditorComponent
  ]
})
export class UeditorModule { }
