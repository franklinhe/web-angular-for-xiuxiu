import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-search-type',
  templateUrl: './search-type.component.html',
  styleUrls: ['./search-type.component.scss']
})
export class SearchTypeComponent implements OnInit{
  @Input()
  searchOptions: any;
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
  @Output() searchTypeChange = new EventEmitter<any[]>();
  @Input() disabled = false;
  @Output() disabledChange = new EventEmitter<string>();
  @Output() init = new EventEmitter();
  planA = environment.planA;
  ngOnInit() {
    this.init.emit(this);
  }
}
