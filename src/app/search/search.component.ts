import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
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
      value: '所有医案',
      label: '所有医案（124354676）',
      children: [
        {
          value: '暂无分类',
          label: '暂无分类',
          children: [
            {
              value: '暂无分类',
              label: '暂无分类',
              isLeaf: true
            }
          ]
        }
      ]
    }
  ];
  // 搜索到的医案数量
  searchResultTab1Number = 0;
  // 搜索到的医书数量
  searchResultTab2Number = 0;
  // 搜索到的医家数量
  searchResultTab3Number = 32424;

  constructor(private http: HttpService) {
    http.getCategoryList().subscribe(res => {
      if (res.code==0&&res.data&&res.msg==="ok") {
        this.apiDataToSearchType(res.data, this.searchType);
      }
    });
    this.getStatCount();
  }

  ngOnInit() {
  }

  searchTypeChanges(values: any): void {
    debugger;
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
}
