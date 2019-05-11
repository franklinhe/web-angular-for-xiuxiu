import {EventEmitter} from '@angular/core';
import {Config, Param} from './model';

/**
 * list data
 */
export abstract class TableList {
  // loading
  isLoading = true;
  // table list all
  list = [];
  // all checked
  checkedList = [];
  checkedEvent = new EventEmitter<any>(true);
  // only one active
  itemIsActive;
  itemActiveEvent = new EventEmitter<any>(true);
  // http param
  param: Param;
  paramChangeEvent = new EventEmitter<any>(true);
  dataChangeEvent = new EventEmitter<any>(true);
  // Initial data
  _param;
  // all checked state
  allChecked = false;
  // half selected state
  indeterminate = false;
  // config
  config: Config = {
    total: 0,
    initList: true
  };

  constructor() {
    this._param = {...this.param};
  }

  /**
   * Processing to get the response results for the next page
   */
  abstract processingDataNextPage(res: any);

  /**
   * next page
   */
  nextPage() {
    const e = new EventEmitter();
    if (this.list.length < this.config.total) {
      this.param.pageNum++;
      this.getList()
        .subscribe((res: any) => {
          this.processingDataNextPage(res);
          this.dataChangeEvent.emit(res);
          e.emit(res);
        });
    }
    return e;
  }

  sort(type, order) {
    this.param['sortName'] = type;
    this.param['sortOrder'] = order;
    this.initList({isActiveFist: false});
  }

  /**
   * init list processing data
   * @returns {Observable<any>}
   */
  abstract processingDataInit(res: any);

  initList(config?: Config, param?: Param) {
    const e = new EventEmitter(true);
    Object.assign(this.config, config);
    Object.assign(this.param, param);
    // init data
    this.param.pageNum = 1;
    this.isLoading = true;
    this.checkedList = [];
    this.getList()
      .subscribe((res: any) => {
        this.isLoading = false;
        this.processingDataInit(res);
        e.emit(res);
        this.dataChangeEvent.emit(res);
      });
    return e;
  }

  abstract getList(_parame?, ...other);

  checked(checked, item, ...other) {
    if (checked) {
      this.checkedList.push(item);
    } else {
      const index = this.checkedList.indexOf(item);
      if (index > -1) {
        this.checkedList.splice(index, 1);
      }
    }

    if (this.list.every(_item => !_item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.list.every(__item => __item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.checkedEvent.emit(this.checkedList);
  }

  /**
   * All/none
   * @param checked
   */
  checkedAll(checked: boolean) {
    this.indeterminate = false;
    if (checked) {
      this.list.forEach((item: any) => {
        item.checked = true;
      });
      this.checkedList = [...this.list];
    } else {
      this.list.forEach((item: any) => {
        item.checked = false;
      });
      this.checkedList = [];
    }
  }

  clearChecked() {
    this.checkedList.forEach(item => item.checked = false);
    this.checkedList = [];
  }

  active(item) {
    if (this.itemIsActive && this.itemIsActive === item) {
      this.itemIsActive = null;
      this.itemActiveEvent.emit();
    } else {
      this.itemIsActive = item;
      this.itemActiveEvent.emit(item);
    }
  }

  delete(item) {
    let index = this.list.indexOf(item);
    if (this.itemIsActive && this.itemIsActive.id === item.id) {
      this.itemIsActive = {};
    }
    if (index > -1) {
      this.list.splice(index, 1);
      this.config.total--;
    }
    index = this.checkedList.indexOf(item);
    if (index > -1) {
      this.checkedList.splice(index, 1);
    }
  }
}
