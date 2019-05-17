import {Component} from '@angular/core';
import {HttpService} from '../service/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../../shared/message/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-app-search-type',
  templateUrl: './app-search-type.component.html',
  styleUrls: ['./app-search-type.component.scss']
})
export class AppSearchTypeComponent {
  searchResult: any = {};
  caseItem = null;
  status: any = {
    diseases: false,
    diseasesButtonHide: false,
    diseasesNode: null,
    diseasesValue: null,
    topBack: false,
    searchstr: '',
    searchResultIndex: 0,
    searchInputPlaceholder: '搜索医案、医书、医家等',
    searchInputDisabled: false,
    searchResultType: ['case', 'book', 'author'],
    bookCataIds: [],
    searchTypeDisabled: false,
    searchOptionsResources: [{
      value: 'all',
      isLeaf: true,
      label: '所有医案'
    }],
    searchOptionsResourcesMapByKey: {},
    searchOptions: [{
      value: 'all',
      isLeaf: true,
      label: '所有医案'
    }],
    casePageNum: 1,
    bookPageNum: 1,
    authorPageNum: 1,
    bookName: null,
    bookAuthor: null,
    bookCataId: null
  };
  states = [];
  diseasesNode: any = [];

  constructor(private http: HttpService,
              private router: Router,
              private msg: MessageService,
              private activateRoute: ActivatedRoute) {
  }
  searchTypeInit(event) {
    this.http.getCategoryList().subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.apiDataToSearchType(res.data, this.status.searchOptions);
        this.apiDataToSearchType(res.data, this.status.searchOptionsResources);
      }
    });
  }
  apiDataToSearchType(data: any[], result: any[]) {
    data.forEach(item => {
      const item_: any = {
        value: item.bookCataId + '',
        label: item.byName + '（' + item.numFound + '）'
      };
      if (item.cataList && item.cataList.length > 0) {
        item_.children = [];
        this.apiDataToSearchType(item.cataList, item_.children);
      } else {
        item_.isLeaf = true;
      }
      this.status.searchOptionsResourcesMapByKey[item_.value] = item_;
      result.push(item_);
    });
  }
  searchResultInit(event) {
    this.searchResult = event;
    this.initSearchResultDate();
  }
  initSearchResultDate() {
    this.searchResult.caseList.list = [];
    this.searchResult.bookNameList.list = [];
    this.searchResult.bookAuthorList.list = [];
    // 医案
    this.searchResult.caseList.param.bookAuthor = this.status.bookAuthor;
    this.searchResult.caseList.param.bookName = this.status.bookName;
    this.searchResult.caseList.param.bookCataId = this.status.bookCataId;
    this.searchResult.caseList.param.pageNum = this.status.casePageNum;
    // 书名
    this.searchResult.bookNameList.param.bookAuthor = this.status.bookAuthor;
    this.searchResult.bookNameList.param.bookName = this.status.bookName;
    this.searchResult.bookNameList.param.pageNum = this.status.bookPageNum;
    this.searchResult.bookNameList.param.bookCataId = this.status.bookCataId;
    // 作者
    this.searchResult.bookAuthorList.param.bookAuthor = this.status.bookAuthor;
    this.searchResult.bookAuthorList.param.bookName = this.status.bookName;
    this.searchResult.bookAuthorList.param.pageNum = this.status.authorPageNum;
    this.searchResult.bookAuthorList.param.bookCataId = this.status.bookCataId;
    if (this.status.searchstr) {
      this.searchResult.caseList.search(this.status.searchstr);
      this.searchResult.bookNameList.search(this.status.searchstr);
      this.searchResult.bookAuthorList.search(this.status.searchstr);
    } else {
      this.searchResult.caseList.initList();
      this.searchResult.bookNameList.initList();
      this.searchResult.bookAuthorList.initList();
    }
  }
  searchTypeChang(values: any[]) {
    if ('all' === values.slice(-1)[0]) {
      this.status.bookCataId = null;
    } else {
      this.status.bookCataId = values.slice(-1)[0];
    }
    this.initSearchResultDate();
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
  diseasesSearch(e) {
    if (e && e.node) {
      this.states.push(this.status);
      this.status = {
        ...this.status,
        diseases: false,
        searchTypeDisabled: true,
        searchInputDisabled: true,
        diseasesNode: e.node,
        diseasesValue: this.status.searchstr,
        searchInputPlaceholder: '病名搜索：「' + this.status.searchstr + '」',
        searchstr: '',
        bookCataId: e.node.key
      };
      this.initSearchResultDate();
    }
  }
  searchStr(value) {
    if (this.status.diseases) {
      this.http.searchCategoryList({searchstr: value}).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.diseasesNode = this.diseasesListToTree(res.data);
        } else {
          this.diseasesNode = [];
        }
      });
    } else {
      this.status.searchstr = value;
      if (this.status.bookName || this.status.bookAuthor) {
        this.searchResult.caseList.search(value);
      } else {
        this.searchResult.caseList.search(value);
        this.searchResult.bookNameList.search(value);
        this.searchResult.bookAuthorList.search(value);
      }
      if (this.status.searchstr && environment.planA) {
        this.status.searchOptions = this.filterSearchOptions(this.status.searchOptionsResources);
        this.status.bookCataIds = [];
        this.status.bookCataId = null;
      } else if (environment.planA) {
        this.status.searchOptions = [...this.status.searchOptionsResources];
      }
    }
  }
  filterSearchOptions(data) {
    return data.filter((o: any) => {
      if (o.label.includes(this.status.searchstr)) {
        return true;
      } else if (o.children && o.children.length > 0) {
        return !!this.filterSearchOptions(o.children);
      } else {
        return false;
      }
    });
  }
  caseContent(data: any) {
    this.caseItem = {title: data.title};
    this.http.getSection({
      articleId: data.articleId || data.caseId,
      bookName: data.title
    }).subscribe(res => {
      if (res.code === '0' && res.data && res.msg === 'ok') {
        this.caseItem = res.data;
      } else {
        this.msg.error('无法获取原文');
        this.caseItem = null;
      }
    });
  }
  bookClick(data) {
    if (this.status.topBack) {
      this.status.searchResultIndex = 0;
      this.status.bookAuthor = null;
      this.status.bookCataId = null;
      this.status.bookCataIds = [];
      this.status.searchResultType = ['case', 'author'];
      this.status.bookName = data.bookName;
      this.status.searchInputPlaceholder = '搜索「' + data.bookName + '」中的医案';
    } else {
      this.states.push({...this.status});
      this.status = {
        ...this.status,
        topBack: true,
        bookCataIds: [],
        bookCataId: null,
        searchTypeDisabled: true,
        searchResultIndex: 0,
        searchResultType: ['case', 'author'],
        bookName: data.bookName,
        searchInputPlaceholder: '搜索「' + data.bookName + '」中的医案'
      };
    }
    this.initSearchResultDate();
  }
  authorSearch(data) {
    if (this.status.topBack) {
      this.status.bookCataId = null;
      this.status.bookCataIds = [];
      this.status.bookAuthor = data.bookAuthor;
      this.status.searchResultIndex = 0;
      this.status.searchResultType = ['case', 'book'];
      this.status.bookName = null;
      this.status.searchInputPlaceholder = '搜索「' + data.bookAuthor + '」著作的医案';
    } else {
      this.states.push({...this.status});
      this.status = {
        ...this.status,
        topBack: true,
        searchTypeDisabled: true,
        bookCataIds: [],
        bookCataId: null,
        searchResultIndex: 0,
        searchResultType: ['case', 'book'],
        bookAuthor: data.bookAuthor,
        searchInputPlaceholder: '搜索「' + data.bookAuthor + '」著作的医案'
      };
    }
    this.initSearchResultDate();
  }
  diseases(e) {
    if (this.status.topBack) {
      this.status.searchInputPlaceholder = '搜索病名...';
      this.status.diseases = true;
    } else {
      this.states.push({...this.status, diseasesButtonHide: false});
      this.status = {
        ...this.status,
        topBack: true,
        diseases: true,

        searchInputPlaceholder: '搜索病名...'
      };
    }
  }
  previous() {
    this.status = this.states.pop();
    this.initSearchResultDate();
  }
}
