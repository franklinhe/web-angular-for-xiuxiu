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
  }
  searchEvent = new EventEmitter<any>(true);

  constructor() {
    super();
    this.searchEvent.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(() => {
        this.isLoading = true;
        return this.getList()})
    ).subscribe((res: any) => {
      this.isLoading = false;
      this.processingDataInit(res);
    });
  }

  /**
   * @param config 
   * @param param 
   */
  initList(config?: Config, param?: Param) {
    let e = new EventEmitter(true);
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
        this.dataChangeEvent.emit(res);
        e.next(res);
        e.complete();
      }, () => {
        this.isLoading = false;
        this.list = [];
      });
    return e;
  }

  /**
   * Getting Paging Data: Do not Change Query Parameters
   */
  getDataOfPage() {
    let e = new EventEmitter(true);
    this.isLoading = true;
    this.checkedList = [];
    this.allChecked = false;
    this.indeterminate = false;
    this.getList()
      .subscribe((res: any) => {
        this.isLoading = false;
        this.processingDataInit(res);
        this.dataChangeEvent.emit(res);
        e.emit(res);
      });
    return e;
  }

  /**
   * @param event 
   */
  search(event: any) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.target) {
      this.param.search = event.target.value;
      this.param.pageNum = 1;
      this.checkedList = [];
      this.allChecked = false;
      this.indeterminate = false;
      this.searchEvent.emit(this.param.search);
    }
  }
  /**
   * @param type 
   * @param order 
   */
  sort(event: any) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    // this.param['sortName'] = type;
    // this.param['sortOrder'] = order;
    // this.initList({isActiveFist: false});
  }

  /**
   * @param res 
   */
  processingDataNextPage(res: any) {
    if (res.code==0&&res.data&&res.msg==="ok") {
      this.list = this.list.concat(res.data.list);
      this.param.pageNum = res.data.pageNum;
      this.config.total = res.data.total;
      if (this.config.isActiveFist && this.list.length > 0) {
        this.active(this.list[0]);
      }
    }
  }

  /**
   * init list processing data
   */
  processingDataInit(res: any) {
    if (res.code==0&&res.data&&res.msg==="ok") {
      this.list = res.data.list;
      this.param.pageNum = res.data.pageNum;
      this.config.total = res.data.total;
      if (this.config.isActiveFist && this.list.length > 0) {
        this.active(this.list[0]);
      }
    } else {
      this.list = [];
      this.config.total = 0;
    }
  }
}
