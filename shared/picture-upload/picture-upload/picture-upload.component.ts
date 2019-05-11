import { Component, Input, OnInit } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { PictureUploadConfig } from '../model';

@Component({
  selector: 'qk-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss'],
  providers: [
    HttpClient
  ]
})
export class PictureUploadComponent implements OnInit {
  defaultConfig: PictureUploadConfig = {
    result: null,
    results: [],
    fileList: [],
    number: 1,
    disabled: false,
    url: 'https://jsonplaceholder.typicode.com/posts/',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      hidePreviewIconInNonImage: true
    }
  };
  @Input() config: PictureUploadConfig = {};
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
      // const isJPG = file.type === 'image/jpeg';
      const isImage = (file.type.indexOf('image/')>-1);
      if (!isImage) {
        this.msg.error('只能上传图片！');
        observer.complete();
        return;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.msg.error('图片必须小于10MB！');
        observer.complete();
        return;
      }
      if (file.size < 10) {
        this.msg.error('文件异常！');
        observer.complete();
        return;
      }
      // check height
      if (this.config.width && this.config.height) {
        this.checkImageDimension(file).then(dimensionRes => {
          if (!dimensionRes) {
            this.msg.error('图片必须是'+this.config.width+'*'+this.config.height);
            observer.complete();
            return;
          }
          observer.next(true);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  };

  remove = (file: UploadFile) => {
    this.config.result = null;
    return true;
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width === this.config.width && height === this.config.height);
      };
    });
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
  };
}
