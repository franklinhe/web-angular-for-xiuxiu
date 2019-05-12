import { Injectable } from '@angular/core';
import { TableList } from '../../shared/table-list/table-list';
import { HttpService } from './http.service';
/**
 * list service
 */
@Injectable()
export class BookNameListService extends TableList {

  param: any = {
    pageNum: 1,
    pageSize: 10,
    bookCataId: null
  };

  constructor(private http: HttpService) {
    super();
  }
  getList(_parame = {}) {
    return this.http.getBookNameList(Object.assign({}, this.param, _parame));
  }
}
