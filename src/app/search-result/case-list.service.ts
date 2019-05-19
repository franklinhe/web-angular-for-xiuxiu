import { Injectable } from '@angular/core';
import { TableList } from '../../shared/table-list/table-list';
import { HttpService } from '../service/http.service';
/**
 * list service
 */
@Injectable()
export class CaseListService extends TableList {
  param: any = {
    searchModel: false,
    pageNum: 1,
    pageSize: 10,
    search: null,
    bookName: null,
    bookAuthor: null,
    bookCataId: null
  };

  constructor(private http: HttpService) {
    super();
  }
  getList(_parame = {}) {
    return this.http.getCaseList(Object.assign({}, this.param, _parame));
  }
}
