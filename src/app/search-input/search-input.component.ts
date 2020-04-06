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

  @Input()  disabled: string;
  @Output() disabledChange = new EventEmitter<string>();

  @Output() previous = new EventEmitter<string>();

  @Input() typeSearch = 'case';
  @Output() typeSearchChange = new EventEmitter<string>();

  @Input() typeSearchShow = true;
  @Output() typeSearchShowChange = new EventEmitter<string>();

  @Output() searchCaseTypeChange = new EventEmitter<any>();
  extended = false;
  smart = false;
  divide = false;

  options: string[] = [];

  constructor(private http: HttpService) { }

  ngOnInit() {
  }

  enter(e: any) {
    e.currentTarget.blur();
    e.target.blur();
    this.searchChange.emit(this.search);
  }

  keyup(e: any) {
    // this.searchChange.emit(e);
  }

  onInput(value: string): void {
    this.http.autoComplete({query: value}).subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.options = res.data.map(v => v.value);
      }
    });
  }

  change(key: string, e: any) {
    if (key == 'extended' && e) {
      this.smart = false;
    } else if (key == 'smart' && e) {
      this.extended = false
    }
    this.searchCaseTypeChange.emit({
      extended: this.extended,
      smart: this.smart, 
      divide: this.divide
    });
  }

}
