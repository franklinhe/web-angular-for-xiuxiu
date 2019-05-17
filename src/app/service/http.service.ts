import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HttpUtil} from '../../shared/http-api/util';
import { Observable, Observer } from 'rxjs';

// import { Observable } from 'rxjs';
/**
 * Call interface API service
 */
@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
  }
  getCategoryList() {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getCategoryList);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/getCategoryList');
    }
  }
  searchGetCategoryList(data?: {
    searchstr?: string
    bookAuthor?: string
    bookName?: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getCategoryList);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/search/getCategoryList', HttpUtil.setParams(data));
    }
  }
  getStatCount(data?: {
    bookCataId: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getStatCount);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/getStatCount', HttpUtil.setParams(data));
    }
  }
  getBookNameList(data: {
    bookCataId?: string|number
    bookAuthor?: string|number	// 作者	string
    bookName?: string|number	// 书名	string	@mock=续名医类案
    search?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getBookNameList);
        observer.complete();
      });
    } else {
      if (data.bookAuthor || data.bookName) {
        return this.getBookNameListBySearch({
          bookCataId: data.bookCataId, // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
          pageNum: data.pageNum,
          pageSize: data.pageSize,
          bookAuthor: data.bookAuthor,	// 作者	string
          bookName: data.bookName,	// 书名	string	@mock=续名医类案
          // searchstr: data.search
        });
      }
      return this.http.get<any>(environment.api + '/book/getBookNameList', HttpUtil.setParams({
        bookCataId: data.bookCataId,
        searchstr: data.search,
        pageNum: data.pageNum,
        pageSize: data.pageSize
      }));
    }
  }
  getBookAuthorList(data: {
    bookCataId?: string|number
    bookAuthor?: string|number	// 作者	string
    bookName?: string|number	// 书名	string	@mock=续名医类案
    search?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getBookAuthorList);
        observer.complete();
      });
    } else {
      if (data.bookAuthor || data.bookName) {
        return this.getBookAuthorListBySearch({
          bookCataId: data.bookCataId, // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
          pageNum: data.pageNum,
          pageSize: data.pageSize,
          bookAuthor: data.bookAuthor,	// 作者	string
          bookName: data.bookName,	// 书名	string	@mock=续名医类案
          // searchstr: data.search
        });
      }
      return this.http.get<any>(environment.api + '/book/getBookAuthorList', HttpUtil.setParams({
        bookCataId: data.bookCataId,
        searchstr:  data.search,
        pageNum: data.pageNum,
        pageSize: data.pageSize
      }));
    }
  }
  getCaseList(data: {
    bookName?: string|number
    bookAuthor?: string|number
    bookCataId?: string
    search?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getCaseList);
        observer.complete();
      });
    } else {
      if ((data.bookCataId && data.bookCataId.includes(',')) || data.search || data.bookAuthor || data.bookName) {
        return this.getCaseListBySearch({
          bookCataId: data.bookCataId || null, // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
          pageNum: data.pageNum,
          pageSize: data.pageSize,
          bookAuthor: data.bookAuthor || null,	// 作者	string
          bookName: data.bookName || null,	// 书名	string	@mock=续名医类案
          searchstr: data.search || null
        });
      }
      return this.http.get<any>(environment.api + '/case/list', HttpUtil.setParams({
        bookCataId: data.bookCataId, // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        bookAuthor: data.bookAuthor,	// 作者	string
        bookName: data.bookName	// 书名	string	@mock=续名医类案
      }));
    }
  }
  getSection(data: {
    articleId: string
    bookName: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getSection);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/case/getSection', HttpUtil.setParams(data));
    }
  }

  // 获取医书列表
  getBookNameListBySearch(data: {
    bookCataId?: string|number // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
    pageNum: string|number
    pageSize: string|number
    bookAuthor?: string|number	// 作者	string
    bookName?: string|number	// 书名	string	@mock=续名医类案
    searchstr?: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getBookNameListBySearch);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/search/getBookNameList', HttpUtil.setParams(data));
    }
  }
  // 获取医家列表
  getBookAuthorListBySearch(data: {
    bookCataId?: string|number // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
    pageNum: string|number
    pageSize: string|number
    bookAuthor?: string|number	// 作者	string
    bookName?: string|number	// 书名	string	@mock=续名医类案
    searchstr?: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getBookAuthorListBySearch);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/search/getBookAuthorList', HttpUtil.setParams(data));
    }
  }
  // 获取医案列表
  getCaseListBySearch(data: {
    bookCataId?: string|number // 取点击节点下的所有bookCataId值，逗号分开	string	@mock=374,380,391,395,296
    pageNum: string|number
    pageSize: string|number
    bookAuthor?: string|number	// 作者	string
    bookName?: string|number	// 书名	string	@mock=续名医类案
    searchstr?: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.getCaseListBySearch);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/search', HttpUtil.setParams(data));
    }
  }
  // 按疾病搜索
  searchCategoryList(data: {
    searchstr: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.searchCategoryList);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/searchCategoryList', HttpUtil.setParams(data));
    }
  }
  autoComplete(data: {
    query: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.autoComplete);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/autoComplete', HttpUtil.setParams(data));
    }
  }
  caseInfo(data: {
    caseId: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next(environment.mockData.autoComplete);
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/case/info', HttpUtil.setParams({...data, userId: '123456789'}));
    }
  }
}
