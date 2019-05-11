import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [PictureUploadComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  exports: [
    PictureUploadComponent
  ]
})
export class PictureUploadModule { }
