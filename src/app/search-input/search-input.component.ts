import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  searchInputPlaceholder = '搜索医案、医书、医家、病名等';
  constructor() { }

  ngOnInit() {
  }

}
