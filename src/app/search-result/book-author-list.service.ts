import { Injectable } from '@angular/core';
import { TableList } from '../../shared/table-list/table-list';
import { HttpService } from '../service/http.service';
/**
 * list service
 */
@Injectable()
export class BookAuthorListService extends TableList {
  param: any = {
    pageNum: 1,
    pageSize: 20,
    search: null,
    bookCataId: null,
    bookAuthor: null,
    bookName: null
  };

  constructor(private http: HttpService) {
    super();
  }
  getList(_parame = {}) {
    return this.http.getBookAuthorList(Object.assign({}, this.param, _parame));
  }
}
