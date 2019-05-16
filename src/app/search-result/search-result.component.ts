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
  tab1Options: any = {
    options: {
      scrollInertia: 300,
      callbacks: {
        onTotalScrollOffset: 300,
        onTotalScroll: () => {
          this.caseList.nextPage();
        }
      }
    }
  };
  tab2Options: any = {
    options: {
      scrollInertia: 300,
      callbacks: {
        onTotalScrollOffset: 300,
        onTotalScroll: () => {
          this.bookNameList.nextPage();
        }
      }
    }
  };
  tab3Options: any = {
    options: {
      scrollInertia: 300,
      callbacks: {
        onTotalScrollOffset: 300,
        onTotalScroll: () => {
          this.bookAuthorList.nextPage();
        }
      }
    }
  };
  tab4Options: any = {};
  @Input() config = ['case', 'book', 'author'];
  @Output() init = new EventEmitter();
  @Output() case = new EventEmitter();
  @Output() book = new EventEmitter();
  @Output() author = new EventEmitter();
  @Input() index: number;
  @Output() indexChange = new EventEmitter();
  categoryList = [];

  constructor(public caseList: CaseListService,
              public bookNameList: BookNameListService,
              public bookAuthorList: BookAuthorListService) {
    caseList.dataChangeEvent.subscribe(() => {
      if (caseList.param.pageNum === 1) {
        this.tab1Options.inited = false;
      }
    });
    bookNameList.dataChangeEvent.subscribe(() => {
      if (bookNameList.param.pageNum === 1) {
        this.tab2Options.inited = false;
      }
    });
    bookAuthorList.dataChangeEvent.subscribe(() => {
      if (bookAuthorList.param.pageNum === 1) {
        this.tab3Options.inited = false;
      }
    });
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
  bookItem(data) {
    this.book.emit(data);
  }
  authorItem(data) {
    this.author.emit(data);
  }
}
