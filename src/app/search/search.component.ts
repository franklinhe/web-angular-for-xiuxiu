import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/http.service';
import { CaseListService } from '../service/case-list.service';
import { BookNameListService } from '../service/book-name-list.service';
import { BookAuthorListService } from '../service/book-author-list.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    CaseListService,
    BookNameListService,
    BookAuthorListService
  ]
})
export class SearchComponent implements OnInit {
  searchInputPlaceholder = "搜索医案、医书、医家、病名等";
  searchTypePlaceholder = "所有医案";
  searchTypeValue: any[] = [];
  /* ['所有医案', ...] or like this:
  values: any[] = [{
    value: 'zhejiang',
    label: 'Zhejiang'
  }, {
    value: 'hangzhou',
    label: 'Hangzhou'
  }, {
    value: 'xihu',
    label: 'West Lake'
  }]; */
  searchType: any = [
    {
      value: 0,
      label: '所有医案'
    }
  ];
  // 搜索到的医案数量
  searchResultTab1Number = 0;
  // 搜索到的医书数量
  searchResultTab2Number = 0;
  // 搜索到的医家数量
  searchResultTab3Number = 32424;

  tab1Options={
    scrollInertia: 101,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.caseList.nextPage();
      }
    }
  };
  tab2Options={
    scrollInertia: 102,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.bookNameList.nextPage();
      }
    }
  };
  tab3Options={
    scrollInertia: 103,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.bookAuthorList.nextPage();
      }
    }
  };

  constructor(private http: HttpService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public caseList: CaseListService,
    public bookNameList: BookNameListService,
    public bookAuthorList: BookAuthorListService) {
    http.getCategoryList().subscribe(res => {
      if (res.code==0&&res.data&&res.msg==="ok") {
        this.apiDataToSearchType(res.data, this.searchType);
      }
    });
    this.getStatCount();
    caseList.initList();
    bookNameList.initList();
    bookAuthorList.initList();
  }

  ngOnInit() {
  }

  searchTypeChanges(values: any): void {
    let id = values.slice(-1)[0];
    if (id) {
      this.getStatCount({bookCataId: values.slice(-1)});
      this.caseList.param.bookCataId = id;
      this.bookNameList.param.bookCataId = id;
      this.bookAuthorList.param.bookCataId = id;
      this.caseList.initList();
      this.bookNameList.initList();
      this.bookAuthorList.initList();
    } else {
      this.getStatCount();
      this.caseList.param.bookCataId = null;
      this.bookNameList.param.bookCataId = null;
      this.bookAuthorList.param.bookCataId = null;
      this.caseList.initList();
      this.bookNameList.initList();
      this.bookAuthorList.initList();
    }
  }

  apiDataToSearchType(data: any[], result: any[]) {
    data.forEach(item => {
      // item = Object.assign(item, {
      //   value: item.bookCataId,
      //   label: item.byName,
      //   children: item.cataList
      // });
      let item_: any = {
        value: item.bookCataId + '',
        label: item.byName + '（' + item.numFound + '）'
      }
      if (item.cataList && item.cataList.length>0) {
        item_.children = []
        this.apiDataToSearchType(item.cataList, item_.children);
      } else {
        item_.isLeaf = true;
      }
      result.push(item_);
    });
  }

  getStatCount(data?: {
    bookCataId: string
  }) {
    this.http.getStatCount(data).subscribe(res => {
      if (res.code==0&&res.data&&res.msg==="ok") {
        this.searchResultTab1Number = res.data.caseCount;
        this.searchResultTab2Number = res.data.bookNameCount;
        this.searchResultTab3Number = res.data.bookAuthorCount;
      }
    });
  }

  bookNameSize(str: string) {
    let base = 5, x:any = 1, y:any = 1, length = str.length;
    if (length > 5) {
      base = 5.5;
      let result = (base/(length)).toFixed(2);
      if (parseFloat(result) < 0.5) {
        x = 0.5;
        y = 0.5;
      } else {
        x = result;
        y = result;
      }
    }
    return {
      '-webkit-transform': 'scale('+x+','+y+')',
      '-moz-transform': 'scale('+x+','+y+')',
      '-o-transform': 'scale('+x+','+y+')',
      'transform': 'scale('+x+','+y+')'
    };
  }
  caseContent(data: any) {
    this.http.contentItem = data;
    this.router.navigate(['../case'], {
      relativeTo: this.activateRoute
    });
  }
}
