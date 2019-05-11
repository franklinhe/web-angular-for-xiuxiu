import { Component, Input, OnInit } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { VideoUploadConfig } from '../model';

@Component({
  selector: 'qk-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss'],
  providers: [
    HttpClient
  ]
})
export class VideoUploadComponent implements OnInit {
  loading = false;
  defaultConfig: VideoUploadConfig = {
    result: null,
    results: [],
    disabled: false,
    url: 'https://jsonplaceholder.typicode.com/posts/',
  };
  @Input() config: VideoUploadConfig = {};
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(private http: HttpClient,
              private msg: NzMessageService) {}

  ngOnInit() {
    Object.assign(this.defaultConfig, this.config);
    Object.assign(this.config, this.defaultConfig);
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.msg.error('视频必须小于10MB！');
        observer.complete();
        return;
      }
      if (file.size < 10) {
        this.msg.error('文件异常！');
        observer.complete();
        return;
      }
        observer.next(true);
        observer.complete();
      // }
    });
  };

  remove = (file: UploadFile) => {
    this.config.result = null;
    return true;
  }

  customReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    const req = new HttpRequest('POST', this.config.url, formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.http.request(req).subscribe(
      (event: HttpEvent<{}>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            // tslint:disable-next-line:no-any
            (event as any).percent = (event.loaded / event.total!) * 100;
          }
          item.onProgress!(event, item.file!);
        } else if (event instanceof HttpResponse) {
          if (event.body['code'] === 200) {
            this.config.result = event.body['responseBody'];
            item.onSuccess!(event.body, item.file!, event);
          } else {
            this.msg.warning("服务异常，上传失败！");
            this.config.fileList = [];
          }
        }
      },
      err => {
        this.msg.warning("服务异常，上传失败！");
        this.config.fileList = [];
        item.onError!(err, item.file!);
      }
    );
  }
  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.  
        this.loading = false;    
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
  deleteV() {
    setTimeout(() => {this.config.result = null}, 180);
  }
}
