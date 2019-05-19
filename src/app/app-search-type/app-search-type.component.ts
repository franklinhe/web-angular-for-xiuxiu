import {Component, EventEmitter} from '@angular/core';
import {HttpService} from '../service/http.service';
import {MessageService} from '../../shared/message/message.service';

@Component({
  selector: 'app-app-search-type',
  templateUrl: './app-search-type.component.html',
  styleUrls: ['./app-search-type.component.scss']
})
export class AppSearchTypeComponent {
  searchResult: any = {};
  bookList: any = null;
  authorList: any = null;
  diseasesNodes: any = [];
  caseItem = null;
  status: any = {
    topInputSearch: {
      topBack: false,
      searchstr: '',
      book: null,
      author: null,
      diseases: null,
      type: 'case',
      searchInputPlaceholder: '搜索医案',
      searchInputDisabled: false,
      searchTypeSelectShow: true,
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
    book: null,
    author: null,
    diseases: null
  };
  states = [];

  constructor(private http: HttpService,
              private msg: MessageService) {
  }

  // 列表组件加载完成
  searchResultInit(event) {
    this.searchResult = event;
    this.searchResult.caseList.param.searchModel = true;
    this.searchResult.bookNameList.param.searchModel = true;
    this.searchResult.bookAuthorList.param.searchModel = true;
    this.initDataByStatus();
  }

  bookListInit(event: any) {
    this.bookList = event.bookNameList;
    this.bookList.search(this.status.topInputSearch.searchstr);
  }

  authorListInit(event: any) {
    this.authorList = event.bookAuthorList;
    this.authorList.search(this.status.topInputSearch.searchstr);
  }

  // case 初始化加载 医案，医术，医家 数据
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

  // 类型切换
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

  // 选择书名 显示搜索结果
  bookSearch(data: any) {
    const cache = [];
    this.states.push({
      ...JSON.parse(JSON.stringify(this.status, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      }))
    });
    this.status.topInputSearch.searchstr = '';
    this.status.topInputSearch.type = 'case';
    this.status.topInputSearch.topBack = true;
    this.status.topInputSearch.searchTypeSelectShow = false;
    this.status.topInputSearch.searchInputPlaceholder = '搜索「' + data.bookName + '」中的医案';
    this.status.resultList.bookName = data.bookName;
    this.status.resultList.searchResultType = ['case', 'author'];
    this.status.resultList.searchResultIndex = 0;
    this.searchResult.caseList.param.bookName = data.bookName;
    this.searchResult.bookAuthorList.param.bookName = data.bookName;
    this.getCategoryList().subscribe(ids => {
      this.searchResult.bookAuthorList.param.bookCataId = ids;
      this.searchResult.caseList.param.bookCataId = ids;
      this.searchResult.bookAuthorList.initList();
      this.searchResult.caseList.initList();
    });
  }

  // 选择医家 显示搜索结果
  authorsSearch(data: any) {
    const cache = [];
    this.states.push({
      ...JSON.parse(JSON.stringify(this.status, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      }))
    });
    this.status.topInputSearch.searchstr = '';
    this.status.topInputSearch.type = 'case';
    this.status.topInputSearch.topBack = true;
    this.status.topInputSearch.searchTypeSelectShow = false;
    this.status.topInputSearch.searchInputPlaceholder = '搜索「' + data.bookAuthor + '」著作的医案';
    this.status.resultList.bookAuthor = data.bookAuthor;
    this.status.resultList.searchResultType = ['case', 'book'];
    this.status.resultList.searchResultIndex = 0;
    this.searchResult.caseList.param.bookAuthor = data.bookAuthor;
    this.searchResult.bookNameList.param.bookAuthor = data.bookAuthor;
    this.getCategoryList().subscribe(ids => {
      this.searchResult.bookNameList.param.bookCataId = ids;
      this.searchResult.caseList.param.bookCataId = ids;
      this.searchResult.bookNameList.initList();
      this.searchResult.caseList.initList();
    });
  }

  // 选择病名 显示搜索结果
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
      this.status.topInputSearch.searchstr = '';
      this.status.topInputSearch.type = 'case';
      this.status.topInputSearch.topBack = true;
      this.status.topInputSearch.searchTypeSelectShow = false;
      this.status.resultList.searchResultIndex = 0;
      this.status.topInputSearch.searchInputPlaceholder = '病名搜索：「' + e.node.title + '」';
      this.status.searchType.bookCataId = e.node.key;
      this.status.diseases = e.node;
      this.status.searchType.searchTypeDisabled = true;
    }
  }

  // 搜索
  searchStr(value: any) {
    if (this.status.topInputSearch.type === 'case' && this.status.diseases) {
      this.status.resultList.searchResultIndex = 0;
      this.searchResult.caseList.search(value);
      this.searchResult.bookNameList.search(value);
      this.searchResult.bookAuthorList.search(value);
    } else if (this.status.topInputSearch.type === 'case') {
      this.status.resultList.searchResultIndex = 0;
      this.getCategoryList().subscribe(id => {
        this.searchResult.caseList.param.bookCataId = id;
        this.searchResult.bookNameList.param.bookCataId = id;
        this.searchResult.bookAuthorList.param.bookCataId = id;
        this.searchResult.caseList.search(value);
        this.searchResult.bookNameList.search(value);
        this.searchResult.bookAuthorList.search(value);
      });
    } else if (this.status.topInputSearch.type === 'book') {
      this.bookList.search(value);
    } else if (this.status.topInputSearch.type === 'author') {
      this.authorList.search(value);
    } else if (this.status.topInputSearch.type === 'diseases') {
      this.http.searchCategoryList({searchstr: value}).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.diseasesNodes = this.diseasesListToTree(res.data);
        } else {
          this.diseasesNodes = [];
        }
      });
    }
  }

  // 获取原文
  caseContent(data: any) {
    this.caseItem = {title: data.title};
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
      this.states.push({
        ...JSON.parse(JSON.stringify(this.status, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        }))
      });
    }
    this.status.topInputSearch.topBack = true;
    this.status.topInputSearch.searchTypeSelectShow = false;
    this.status.topInputSearch.searchInputPlaceholder = '搜索「' + data.bookName + '」中的医案';
    this.status.resultList.bookName = data.bookName;
    this.status.resultList.searchResultType = ['case', 'author'];
    this.status.resultList.searchResultIndex = 0;
    this.searchResult.caseList.param.bookName = data.bookName;
    this.searchResult.bookAuthorList.param.bookName = data.bookName;
    this.getCategoryList().subscribe(ids => {
      this.searchResult.bookAuthorList.param.bookCataId = ids;
      this.searchResult.caseList.param.bookCataId = ids;
      this.searchResult.bookAuthorList.initList();
      this.searchResult.caseList.initList();
    });
  }

  // 点击医家 查询
  authorSearch(data: any) {
    if (!this.status.resultList.bookAuthor || !this.status.resultList.bookName) {
      const cache = [];
      this.states.push({
        ...JSON.parse(JSON.stringify(this.status, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        }))
      });
    }
    this.status.topInputSearch.topBack = true;
    this.status.topInputSearch.searchTypeSelectShow = false;
    this.status.topInputSearch.searchInputPlaceholder = '搜索「' + data.bookAuthor + '」著作的医案';
    this.status.resultList.bookAuthor = data.bookAuthor;
    this.status.resultList.searchResultType = ['case', 'book'];
    this.status.resultList.searchResultIndex = 0;
    this.searchResult.caseList.param.bookAuthor = data.bookAuthor;
    this.searchResult.bookNameList.param.bookAuthor = data.bookAuthor;
    this.getCategoryList().subscribe(ids => {
      this.searchResult.bookNameList.param.bookCataId = ids;
      this.searchResult.caseList.param.bookCataId = ids;
      this.searchResult.bookNameList.initList();
      this.searchResult.caseList.initList();
    });
  }

  // 点击 分类查询模式
  typeSearch(e: any) {
    if (e === 'case') {
      this.status.topInputSearch.searchInputPlaceholder = '搜索医案';
      // this.searchStr(this.status.topInputSearch.searchstr);
    } else if (e === 'book') {
      this.status.topInputSearch.searchInputPlaceholder = '搜索医书';
      // this.bookList.search(this.status.topInputSearch.searchstr);
    } else if (e === 'author') {
      this.status.topInputSearch.searchInputPlaceholder = '搜索医家';
      // this.authorList.search(this.status.topInputSearch.searchstr);
    } else if (e === 'diseases') {
      this.status.topInputSearch.searchInputPlaceholder = '搜索病名';
      this.http.searchCategoryList({searchstr: this.status.topInputSearch.searchstr}).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.diseasesNodes = this.diseasesListToTree(res.data);
        } else {
          this.diseasesNodes = [];
        }
      });
    }
  }

  // 返回上一步
  previous() {
    this.status = this.states.pop();
    this.initDataByStatus();
  }

  // 获取分类
  getCategoryList() {
    const e = new EventEmitter<any>();
    const result = (res: any) => {
      this.status.searchType.searchOptions = [{
        value: 'all',
        isLeaf: true,
        label: '所有医案'
      }];
      this.status.searchType.bookCataId = null;
      this.status.searchType.bookCataIds = [];
      this.status.searchType.searchTypeIdMap = {};
      if (res.code === '0' && res.data && res.msg === 'ok') {
        this.status.searchType.searchTypeIdMap['all'] = this.apiDataToSearchType(res.data, this.status.searchType.searchOptions);
        e.emit(this.status.searchType.searchTypeIdMap['all']);
      } else {
        e.emit(null);
      }
    };
    if (this.status.topInputSearch.searchstr || this.status.resultList.bookAuthor || this.status.resultList.bookName) {
      this.http.searchGetCategoryList({
        searchstr: this.status.topInputSearch.searchstr || null,
        bookAuthor: this.status.resultList.bookAuthor || null,
        bookName: this.status.resultList.bookName || null,
      }).subscribe(result);
    } else {
      this.http.getCategoryList().subscribe(result);
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
