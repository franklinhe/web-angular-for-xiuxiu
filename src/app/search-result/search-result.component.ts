import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {CaseListService} from './case-list.service';
import {BookNameListService} from './book-name-list.service';
import {BookAuthorListService} from './book-author-list.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [
    CaseListService,
    BookNameListService,
    BookAuthorListService
  ]
})
export class SearchResultComponent implements OnInit {
  tab1Options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 30,
      alwaysTriggerOffsets: false,
      onTotalScroll: () => {
        this.caseList.nextPage();
      }
    }
  };
  tab2Options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 30,
      alwaysTriggerOffsets: false,
      onTotalScroll: () => {
        this.bookNameList.nextPage();
      }
    }
  };
  tab3Options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 30,
      alwaysTriggerOffsets: false,
      onTotalScroll: () => {
        this.bookAuthorList.nextPage();
      }
    }
  };
  @Input() config = ['case', 'book', 'author'];
  @Output() init = new EventEmitter();
  @Output() case = new EventEmitter();

  constructor(public caseList: CaseListService,
              public bookNameList: BookNameListService,
              public bookAuthorList: BookAuthorListService) {
  }

  ngOnInit() {
    this.init.emit(this);
  }

  bookNameSize(str: string) {
    let base = 5, x: any = 1, y: any = 1;
    const length = str.length;
    if (length > 5) {
      base = 5.5;
      const result = (base / (length)).toFixed(2);
      if (parseFloat(result) < 0.5) {
        x = 0.5;
        y = 0.5;
      } else {
        x = result;
        y = result;
      }
    }
    return {
      '-webkit-transform': 'scale(' + x + ',' + y + ')',
      '-moz-transform': 'scale(' + x + ',' + y + ')',
      '-o-transform': 'scale(' + x + ',' + y + ')',
      'transform': 'scale(' + x + ',' + y + ')'
    };
  }
  caseContent(data) {
    this.case.emit(data);
  }
}
