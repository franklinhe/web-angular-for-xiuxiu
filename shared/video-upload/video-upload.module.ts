import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [VideoUploadComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  exports: [
    VideoUploadComponent
  ]
})
export class VideoUploadModule { }
