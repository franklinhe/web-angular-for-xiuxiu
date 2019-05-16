import {Component, Output, EventEmitter, Input} from '@angular/core';
import {HttpService} from '../service/http.service';

@Component({
  selector: 'app-search-type',
  templateUrl: './search-type.component.html',
  styleUrls: ['./search-type.component.scss']
})
export class SearchTypeComponent {
  searchOptions: any = [
    {
      value: 'all',
      isLeaf: true,
      label: '所有医案'
    }
  ];
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
  @Input() searchType: any[];
  @Output() searchTypeChange = new EventEmitter<string>();
  @Input() disabled = false;
  @Output() disabledChange = new EventEmitter<string>();

  constructor(private http: HttpService) {
    http.getCategoryList().subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.apiDataToSearchType(res.data, this.searchOptions);
      }
    });
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
