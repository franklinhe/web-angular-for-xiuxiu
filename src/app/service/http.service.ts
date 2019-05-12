import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HttpUtil} from '../../shared/http-api/util';
// import { Observable } from 'rxjs';
/**
 * Call interface API service
 */
@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getCategoryList() {
    return this.http.get<any>(environment.api + '/book/getCategoryList');
  }
  getStatCount(data?: {
    bookCataId: string
  }) {
    return this.http.get<any>(environment.api + '/book/getStatCount', HttpUtil.setParams(data));
  }
  getBookNameList(data: {
    bookCataId?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    return this.http.get<any>(environment.api + '/book/getBookNameList', HttpUtil.setParams(data));
  }
  getBookAuthorList(data: {
    bookCataId?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    return this.http.get<any>(environment.api + '/book/getBookAuthorList', HttpUtil.setParams(data));
  }
  getCaseList(data: {
    bookName?: string|number
    bookAuthor?: string|number
    bookCataId?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    return this.http.get<any>(environment.api + '/case/list', HttpUtil.setParams(data));
  }
  // 医案内容
  contentItem: any = null;
  getSection(data: {
    articleId: string
    bookName: string
  }) {
    return this.http.get<any>(environment.api + '/case/getSection', HttpUtil.setParams(data));
  }
}
