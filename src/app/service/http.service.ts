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
  
}
