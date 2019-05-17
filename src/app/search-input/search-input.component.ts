import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-search-input',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Input()  placeholder: string;
  @Output() placeholderChange = new EventEmitter<string>();

  @Input()  back: string;
  @Output() backChange = new EventEmitter<string>();

  @Input()  search: string;
  @Output() searchChange = new EventEmitter<string>();

  @Input()  diseases: string;
  @Output() diseasesChange = new EventEmitter<any>();

  @Input()  disabled: string;
  @Output() disabledChange = new EventEmitter<string>();

  @Output() previous = new EventEmitter<string>();

  options: string[] = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
  }

  enter(e) {
    e.currentTarget.blur();
    e.target.blur();
    this.searchChange.emit(this.search);
  }

  keyup(e) {
    // this.searchChange.emit(e);
  }

  onInput(value: string): void {
    this.http.autoComplete({query: value}).subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.options = res.data.map(v => v.value);
      }
    });
  }

}
