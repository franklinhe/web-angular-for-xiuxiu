import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
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
  @Output() diseasesChange = new EventEmitter<string>();

  @Input()  disabled: string;
  @Output() disabledChange = new EventEmitter<string>();

  @Output() previous = new EventEmitter<string>();

  constructor() { }

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

}
