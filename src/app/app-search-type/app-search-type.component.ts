import { Component, EventEmitter } from '@angular/core';
import { HttpService } from '../service/http.service';
import { MessageService } from '../../shared/message/message.service';

@Component({
  selector: 'app-app-search-type',
  templateUrl: './app-search-type.component.html',
  styleUrls: ['./app-search-type.component.scss']
})
export class AppSearchTypeComponent {
  searchResult: any = {};
  caseItem = null;
  status: any = {
    topInputSearch: {
      topBack: false,
      searchstr: '',
      searchInputPlaceholder: '搜索医案、医书、医家等',
      searchInputDisabled: false,
      diseasesButtonHide: false,
    },
    searchType: {
      searchOptions: [],
      bookCataId: null,
      bookCataIds: [],
      searchTypeIdMap: {},
      searchTypeDisabled: false,
    },
    resultList: {
      searchResultIndex: 0,
      searchResultType: ['case', 'book', 'author'],
      casePageNum: 1,
      bookPageNum: 1,
      authorPageNum: 1,
      bookName: null,
      bookAuthor: null
    },
    diseases: {
      active: false,
      diseasesNode: null,
      diseasesValue: null,
      diseasesNodes: []
    },
  };
  states = [];
  constructor(private http: HttpService,
    private msg: MessageService) {
  }
  // 初始化加载 医案，医术，医家 数据 
  searchResultInit(event) {
    this.searchResult = event;
    this.initDataByStatus();
  }
  initDataByStatus() {
    // 医案
    this.searchResult.caseList.param.bookAuthor = this.status.resultList.bookAuthor;
    this.searchResult.caseList.param.bookName = this.status.resultList.bookName;
    this.searchResult.caseList.param.bookCataId = this.status.searchType.bookCataId;
    this.searchResult.caseList.param.search = this.status.topInputSearch.searchstr;
    // 书名
    this.searchResult.bookNameList.param.bookAuthor = this.status.resultList.bookAuthor;
    this.searchResult.bookNameList.param.bookName = this.status.resultList.bookName;
    this.searchResult.bookNameList.param.bookCataId = this.status.searchType.bookCataId;
    this.searchResult.bookNameList.param.search = this.status.topInputSearch.searchstr;
    // 作者
    this.searchResult.bookAuthorList.param.bookAuthor = this.status.resultList.bookAuthor;
    this.searchResult.bookAuthorList.param.bookName = this.status.resultList.bookName;
    this.searchResult.bookAuthorList.param.bookCataId = this.status.searchType.bookCataId;
    this.searchResult.bookAuthorList.param.search = this.status.topInputSearch.searchstr;
    // init data
    this.searchResult.caseList.initList();
    this.searchResult.bookNameList.initList();
    this.searchResult.bookAuthorList.initList();
  }
  searchTypeChang(values: any[]) {
    if ('all' === values.slice(-1)[0] && this.status.topInputSearch.searchstr) {
      this.status.searchType.bookCataId = this.status.searchType.searchTypeIdMap['all'];
    } else if ('all' === values.slice(-1)[0]) {
      this.status.searchType.bookCataId = null;
    } else if (this.status.topInputSearch.searchstr) {
      this.status.searchType.bookCataId = this.status.searchType.searchTypeIdMap[values.slice(-1)[0]];
    } else {
      this.status.searchType.bookCataId = values.slice(-1)[0];
    }
    this.initDataByStatus();
  }
  searchStr(value: any) {
    if (this.status.diseases.active) {
      this.http.searchCategoryList({searchstr: value}).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.status.diseases.diseasesNodes = this.diseasesListToTree(res.data);
        } else {
          this.status.diseases.diseasesNodes = [];
        }
      });
    } else {
      if (!value) {
        this.searchResult.caseList.param.bookCataId = null;
        this.searchResult.caseList.search(value);
        this.searchResult.bookNameList.param.search = null;
        this.searchResult.bookAuthorList.param.search = null;
        this.searchResult.bookNameList.param.bookCataId = null;
        this.searchResult.bookAuthorList.param.bookCataId = null;
        this.searchResult.bookNameList.search(value);
        this.searchResult.bookAuthorList.search(value);
      }
      if (!this.status.resultList.bookAuthor && !this.status.resultList.bookName) {
        this.getCategoryList().subscribe(id => {
          this.searchResult.bookNameList.param.bookCataId = id;
          this.searchResult.bookAuthorList.param.bookCataId = id;
          this.searchResult.bookNameList.search(value);
          this.searchResult.bookAuthorList.search(value);
        });
      } else {
        this.searchResult.caseList.search(value);
        this.searchResult.bookNameList.search(value);
        this.searchResult.bookAuthorList.search(value);
      }
    }
  }
  // 获取原文
  caseContent(data: any) {
    this.caseItem = { title: data.title };
    if (data.articleId) {
      this.http.getSection({
        articleId: data.articleId,
        bookName: data.title
      }).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.caseItem = res.data;
        } else {
          this.msg.error('无法获取原文');
          this.caseItem = null;
        }
      });
    } else if (data.caseId) {
      this.http.caseInfo({
        caseId: data.caseId
      }).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.caseItem = res.data.caseInfo;
        } else {
          this.msg.error('无法获取原文');
          this.caseItem = null;
        }
      });
    }
  }
  // 点击医书 查询
  bookClick(data: any) {
    if (!this.status.resultList.bookAuthor || !this.status.resultList.bookName) {
      const cache = [];
      this.states.push({ ...JSON.parse(JSON.stringify(this.status, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    })) });
    }
    this.status.topInputSearch.topBack = true;
    // this.status.topInputSearch.searchInputDisabled = true;
    // this.status.searchType.searchTypeDisabled = true;
    this.status.topInputSearch.searchInputPlaceholder = '搜索「' + data.bookName + '」中的医案';
    this.status.resultList.bookName = data.bookName;
    this.status.resultList.searchResultType = ['case', 'author'];
    this.status.resultList.searchResultIndex = 0;
    this.initDataByStatus();
  }
  // 点击医家 查询
  authorSearch(data: any) {
    if (!this.status.resultList.bookAuthor || !this.status.resultList.bookName) {
      const cache = [];
      this.states.push({ ...JSON.parse(JSON.stringify(this.status, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    })) });
    }
    this.status.topInputSearch.topBack = true;
    // this.status.topInputSearch.searchInputDisabled = true;
    // this.status.searchType.searchTypeDisabled = true;
    this.status.topInputSearch.searchInputPlaceholder = '搜索「' + data.bookAuthor + '」著作的医案';
    this.status.resultList.bookAuthor = data.bookAuthor;
    this.status.resultList.searchResultType = ['case', 'book'];
    this.status.resultList.searchResultIndex = 0;
    this.initDataByStatus();
  }
  // 点击 病名 进入病名查询模式
  diseases(e: any) {
    const cache = [];
    this.states.push({ ...JSON.parse(JSON.stringify(this.status, (key, value) => {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  })), diseasesButtonHide: false });
    this.status.topInputSearch.topBack = true;
    this.status.diseases.active = true;
    this.status.topInputSearch.searchInputPlaceholder = '搜索病名...';
  }
  // 选择病名 查询相关 的 医案，医术，医家
  diseasesSearch(e: any) {
    if (e && e.node) {
      const cache = [];
      this.states.push(JSON.parse(JSON.stringify(this.status, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    })));
      this.status.diseases.active = false;
      this.status.searchType.searchTypeDisabled = true;
      this.status.topInputSearch.searchInputDisabled = true;
      this.status.diseases.diseasesNode = {title: e.node.title};
      this.status.diseases.diseasesValue = this.status.topInputSearch.searchstr;
      this.status.topInputSearch.searchInputPlaceholder = '病名搜索：「' + this.status.diseases.diseasesValue + '」';
      this.status.topInputSearch.searchstr = '';
      this.status.searchType.bookCataId = e.node.key;
      this.status.resultList.searchResultType = ['case'];
      this.initDataByStatus();
    }
  }
  // 返回上一步
  previous() {
    this.status = this.states.pop();
    this.initDataByStatus();
  }
  // 获取分类
  getCategoryList() {
    let e = new EventEmitter<any>();
    if (this.status.topInputSearch.searchstr || this.status.resultList.bookAuthor || this.status.resultList.bookName) {
      this.http.searchGetCategoryList({
        searchstr: this.status.topInputSearch.searchstr || null,
        bookAuthor: this.status.resultList.bookAuthor || null,
        bookName: this.status.resultList.bookName || null,
      }).subscribe(res => {
        this.status.searchType.searchOptions = [{
          value: 'all',
          isLeaf: true,
          label: '所有医案'
        }];
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.status.searchType.searchTypeIdMap = {};
          this.status.searchType.searchTypeIdMap['all'] = this.apiDataToSearchType(res.data, this.status.searchType.searchOptions);
          this.searchResult.caseList.param.bookCataId = this.status.searchType.searchTypeIdMap['all'];
          e.emit(this.searchResult.caseList.param.bookCataId);
        } else {
          e.emit(null);
        }
        this.searchResult.caseList.search(this.status.topInputSearch.searchstr);
      });
    } else {
      this.http.getCategoryList().subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.status.searchType.searchOptions = [{
            value: 'all',
            isLeaf: true,
            label: '所有医案'
          }];
          this.status.searchType.bookCataIds = [];
          this.status.searchType.bookCataId = null;
          this.apiDataToSearchType(res.data, this.status.searchType.searchOptions);
        }
      });
    }
    return e;
  }
  diseasesListToTree(data: any[]) {
    data.forEach(item => {
      Object.assign(item, {
        title: item.byName,
        key: item.bookCataId,
        expanded: true,
        isLeaf: (item.children && (item.children.length > 0)),
        children: item.cataList || null
      });
      if (item.children && item.children.length > 0) {
        this.diseasesListToTree(item.children);
      }
    });
    return data;
  }
  apiDataToSearchType(data: any[], result: any[]) {
    let ids = [];
    data.forEach(item => {
      ids.push(item.bookCataId);
      const item_: any = {
        value: item.bookCataId + '',
        label: item.byName + '（' + item.numFound + '）'
      };
      if (item.cataList && item.cataList.length > 0) {
        item_.children = [];
        this.status.searchType.searchTypeIdMap[item_.value] = this.apiDataToSearchType(item.cataList, item_.children);
        ids = ids.concat(this.apiDataToSearchType(item.cataList, item_.children));
      } else {
        this.status.searchType.searchTypeIdMap[item_.value] = item_.value;
        item_.isLeaf = true;
      }
      result.push(item_);
    });
    return ids.join(',');
  }
}
