import { Component, EventEmitter } from '@angular/core';
import { HttpService } from '../service/http.service';
import { MessageService } from '../../shared/message/message.service';
import { GlobeService } from '../service/globe.service';
import { NzModalService } from 'ng-zorro-antd';
import { AnalysisComponent } from '../analysis/analysis.component';
import { Arabic } from 'src/shared/util/arabic';
import { DrugItemComponent } from '../drug-item/drug-item.component';
import { UnitComponent } from '../unit/unit.component';

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
  caseItem: any = null;
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
      extended:false,
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
      searchResultIndexBase: 0,
      searchResultIndexBaseCheck: false,
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
  destroy = [];

  constructor(private http: HttpService,
    private nzModal: NzModalService,
    private globe: GlobeService,
    private msg: MessageService) {
  }

  ngOnDestroy() {
    this.destroy.forEach(item => {
      item.unsubscribe && item.unsubscribe();
      item.close && item.close();
    })
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
    this.searchResult.caseList.param.extended = this.status.topInputSearch.extended;
    // 书名
    this.searchResult.bookNameList.param.bookAuthor = this.status.resultList.bookAuthor;
    this.searchResult.bookNameList.param.bookName = this.status.resultList.bookName;
    this.searchResult.bookNameList.param.bookCataId = this.status.searchType.bookCataId;
    this.searchResult.bookNameList.param.search = this.status.topInputSearch.searchstr;
    this.searchResult.bookNameList.param.extended = this.status.topInputSearch.extended;
    // 作者
    this.searchResult.bookAuthorList.param.bookAuthor = this.status.resultList.bookAuthor;
    this.searchResult.bookAuthorList.param.bookName = this.status.resultList.bookName;
    this.searchResult.bookAuthorList.param.bookCataId = this.status.searchType.bookCataId;
    this.searchResult.bookAuthorList.param.search = this.status.topInputSearch.searchstr;
    this.searchResult.bookAuthorList.param.extended = this.status.topInputSearch.extended;
    // init data
    this.searchResult.caseList.initList();
    this.searchResult.bookNameList.initList();
    this.searchResult.bookAuthorList.initList();
  }

  // 类型切换
  searchTypeChang(values: any[]) {
    this.status.searchType.bookCataId = this.status.searchType.searchTypeIdMap[values.slice(-1)[0]];
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
      // this.status.resultList.searchResultIndex = 0;
      this.searchResult.caseList.search(value);
      this.searchResult.bookNameList.search(value);
      this.searchResult.bookAuthorList.search(value);
    } else if (this.status.topInputSearch.type === 'case') {
      this.status.searchType.bookCataId = null;
      this.status.searchType.bookCataIds = [];
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
      this.http.searchCategoryList({ searchstr: value }).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          this.diseasesNodes = this.diseasesListToTree(res.data);
        } else {
          this.diseasesNodes = [];
        }
      });
    }

  }
  
  alias(e: any) {
    if (e == true) {
      this.status.topInputSearch.extended = true;
    } else {
      this.status.topInputSearch.extended = false;
    }
    this.searchResult.caseList.param.extended = e;
    this.searchResult.bookNameList.param.extended = e;
  
    this.searchResult.bookAuthorList.param.extended = e;    

  }

  vocab(e: any) {
    if (e == true) {
      this.status.topInputSearch.smart = true;
    } else {
      this.status.topInputSearch.smart = false;
    }
    this.searchResult.caseList.param.smart = e;
    this.searchResult.bookNameList.param.smart = e;
    this.searchResult.bookAuthorList.param.smart = e;    
  }
  // 分析
  analysis(item: any, content?: string) {
    let tplModal = this.nzModal.create({
      nzTitle: item.title + (': ' +content),
      nzContent: AnalysisComponent,
      nzComponentParams: {
        item,
        data: content||item.content
      },
      nzWidth: "98vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    this.destroy.push(tplModal);
  }

  // 获取原文
  caseContent(data: any) {
    let getContent = (data: any) => {
      const showInfo = (text: string) => {
        let showText = text;
        [...Arabic.zhDigit, ...this.globe.analysis.reduce((drugA, drugB) => {
          if (Array.isArray(drugA)) {
            return drugA.concat([drugB['饮片名']].concat(drugB['同异名'].split("、")));
          } else {
            return [drugB['饮片名']].concat(drugB['同异名'].split("、")).concat([drugA['饮片名']].concat(drugA['同异名'].split("、")));
          }
        }), ...[...this.globe.unitList, ...this.globe.unitOtherList].map(u => u.name)].forEach((s: string) => {
          if (s) showText = showText.replace(new RegExp(s, 'g'), '<span style="color:#0089e0;">' + s + '</span>')
        })
        return showText;
      }
      this.caseItem = data;
      this.caseItem.contentShow = showInfo(this.caseItem.content);
      this.caseItem.contentParts = this.globe.caseContent(this.caseItem.content, {type: (this.caseItem['articleId'] ? 'article' : 'case'), 
      id: (this.caseItem['articleId'] ? this.caseItem['articleId'] : this.caseItem['caseId'])}).contentsAndanalysis;
    }
    this.caseItem = { title: data.title };
    if (data.articleId) {
      this.http.getSection({
        articleId: data.articleId,
        bookName: data.title
      }).subscribe(res => {
        if (res.code === '0' && res.data && res.msg === 'ok') {
          getContent(res.data);
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
          getContent(res.data.caseInfo);
        } else {
          this.msg.error('无法获取原文');
          this.caseItem = null;
        }
      });
    }
  }

  drugByName(name: string) {
    const item = this.globe.drugs[name];
    let tplModal = this.nzModal.create({
      nzTitle: item['饮片名'],
      nzContent: DrugItemComponent,
      nzComponentParams: {
        edit: true,
        data: {
          ...item
        }
      },
      nzWidth: "85vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    tplModal.afterClose.subscribe((e: any) => {
      if (e) {
        this.globe.pushDrugsEditLoaclStorage({
          ...e, pre: {'饮片名': item['饮片名'], '同异名': item['同异名']}, old: (item.old || {'饮片名': item['饮片名'], '同异名': item['同异名']})
        });
        this.globe.pushDrugsEditFlag = true;
      }
    })
    this.destroy.push(tplModal);
  }

  unit() {
    let tplModal = this.nzModal.create({
      nzTitle: `计量换算`,
      nzContent: UnitComponent,
      nzComponentParams: {},
      nzWidth: "70vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    this.destroy.push(tplModal);
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
    if (this.status.diseases) {
      this.searchResult.bookAuthorList.initList();
      this.searchResult.caseList.initList();
    } else {
      this.getCategoryList().subscribe(ids => {
        this.searchResult.bookAuthorList.param.bookCataId = this.status.searchType.bookCataId;
        this.searchResult.caseList.param.bookCataId = this.status.searchType.bookCataId;
        this.searchResult.bookAuthorList.initList();
        this.searchResult.caseList.initList();
      });
    }
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
    if (this.status.diseases) {
      this.searchResult.bookNameList.initList();
      this.searchResult.caseList.initList();
    } else {
      this.getCategoryList().subscribe(ids => {
        this.searchResult.bookNameList.param.bookCataId = this.status.searchType.bookCataId;
        this.searchResult.caseList.param.bookCataId = this.status.searchType.bookCataId;
        this.searchResult.bookNameList.initList();
        this.searchResult.caseList.initList();
      });
    }
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
      this.http.searchCategoryList({ searchstr: this.status.topInputSearch.searchstr }).subscribe(res => {
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
    setTimeout(() => {
      this.status.resultList.searchResultIndexBaseCheck = true;
      this.status.resultList.searchResultIndex = 0;
    }, 15);
    setTimeout(() => {
      this.status.resultList.searchResultIndex = this.status.resultList.searchResultIndexBase;
    }, 30);
  }

  searchResultIndexChange(index: number) {
    if (!this.status.resultList.searchResultIndexBaseCheck) {
      this.status.resultList.searchResultIndexBase = index;
    }
    this.status.resultList.searchResultIndexBaseCheck = false;
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
        ids = ids.concat(this.status.searchType.searchTypeIdMap[item_.value]);
      } else {
        this.status.searchType.searchTypeIdMap[item_.value] = item_.value;
        item_.isLeaf = true;
      }
      result.push(item_);
    });
    return ids.join(',');
  }
}
