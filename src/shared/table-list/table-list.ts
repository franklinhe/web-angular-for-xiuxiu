import {EventEmitter} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {TableList as TableListAbstract} from './core/table-list';
import {Config, Param} from './core/model';

/**
 * list data
 */
export abstract class TableList extends TableListAbstract {
  // param
  param: any = {
    page: 1,
    pageSize: 50,
    search: '',
  };
  searchEvent = new EventEmitter<any>(true);
  nextPageLoading = false;

  constructor() {
    super();
    this.searchEvent.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(() => {
        this.isLoading = true;
        return this.getList();
      })
    ).subscribe((res: any) => {
      this.isLoading = false;
      this.processingDataInit(res);
    });
  }

  initList(config?: Config, param?: Param) {
    const e = new EventEmitter(true);
    Object.assign(this.config, config);
    Object.assign(this.param, param);
    // init data
    this.param.pageNum = 1;
    this.isLoading = true;
    this.checkedList = [];
    this.allChecked = false;
    this.indeterminate = false;
    return this.getList()
      .subscribe((res: any) => {
        this.isLoading = false;
        this.processingDataInit(res);
        e.next(res);
        e.complete();
      }, () => {
        this.isLoading = false;
        this.list = [];
      });
    return e;
  }

  /**
   * table next page
   * Getting Paging Data: Do not Change Query Parameters
   */
  getDataOfPage() {
    const e = new EventEmitter(true);
    this.isLoading = true;
    this.checkedList = [];
    this.allChecked = false;
    this.indeterminate = false;
    this.getList()
      .subscribe((res: any) => {
        this.isLoading = false;
        this.processingDataInit(res);
        e.emit(res);
      });
    return e;
  }

  /**
   * next page for scrollbar
   */
  nextPage() {
    if (!this.nextPageLoading && this.list.length < this.config.total) {
      this.nextPageLoading = true;
      this.param.pageNum++;
      this.getList().subscribe((res: any) => {
        this.processingDataNextPage(res);
      });
    }
  }

  search(event: any) {
    this.param.search = event;
    this.param.pageNum = 1;
    this.searchEvent.emit(event);
  }

  sort(event: any) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    // this.param['sortName'] = type;
    // this.param['sortOrder'] = order;
    // this.initList({isActiveFist: false});
  }

  processingDataNextPage(res: any) {
    if (res.code === '0' && res.data && res.msg === 'ok') {
      this.list = this.list.concat(res.data.list);
      this.param.pageNum = res.data.pageNum;
      this.config.total = res.data.total;
      this.dataChangeEvent.emit(res);
      this.nextPageLoading = false;
      if (this.config.isActiveFist && this.list.length > 0) {
        this.active(this.list[0]);
      }
    }
  }

  /**
   * init list processing data
   */
  processingDataInit(res: any) {
    if (res.code === '0' && res.data && res.msg === 'ok') {
      this.list = res.data.list;
      this.param.pageNum = res.data.pageNum;
      this.config.total = res.data.total;
      this.dataChangeEvent.emit(res);
      if (this.config.isActiveFist && this.list.length > 0) {
        this.active(this.list[0]);
      }
    } else {
      this.list = [];
      this.config.total = 0;
    }
  }
}
