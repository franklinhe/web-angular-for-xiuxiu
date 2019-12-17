import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TableList } from './table-list';
/**
 * list service
 */
@Injectable()
export class TableListModel extends TableList {
  param: any = {
    pageNum: 1,
    pageSize: 10
  };

  getList(_parame = {}) {
    return of();
  }
}
