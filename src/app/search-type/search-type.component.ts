import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpService} from '../service/http.service';

@Component({
  selector: 'app-search-type',
  templateUrl: './search-type.component.html',
  styleUrls: ['./search-type.component.scss']
})
export class SearchTypeComponent implements OnInit {
  searchTypePlaceholder = '所有医案';
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
      isLeaf: true,
      label: '所有医案'
    }
  ];
  @Output() change = new EventEmitter();
  constructor(private http: HttpService) {
    http.getCategoryList().subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.apiDataToSearchType(res.data, this.searchType);
      }
    });
  }

  ngOnInit() {
  }

  searchTypeChanges(values: any): void {
    this.change.emit(values.slice(-1)[0]);
  }

  apiDataToSearchType(data: any[], result: any[]) {
    data.forEach(item => {
      // item = Object.assign(item, {
      //   value: item.bookCataId,
      //   label: item.byName,
      //   children: item.cataList
      // });
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
      result.push(item_);
    });
  }

}
