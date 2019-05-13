import {Component} from '@angular/core';
import {HttpService} from '../service/http.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-app-search-type',
  templateUrl: './app-search-type.component.html',
  styleUrls: ['./app-search-type.component.scss']
})
export class AppSearchTypeComponent {
  searchResult: any = {};
  caseItem = null;

  constructor(private http: HttpService,
              private router: Router,
              private activateRoute: ActivatedRoute) {
  }

  searchResultInit(event) {
    this.searchResult = event;
    this.getStatCount();
    this.searchResult.caseList.initList();
    this.searchResult.bookNameList.initList();
    this.searchResult.bookAuthorList.initList();
  }

  searchTypeChang(id) {
    if (id) {
      this.getStatCount({bookCataId: id});
      this.searchResult.caseList.param.bookCataId = id;
      this.searchResult.bookNameList.param.bookCataId = id;
      this.searchResult.bookAuthorList.param.bookCataId = id;
      this.searchResult.caseList.initList();
      this.searchResult.bookNameList.initList();
      this.searchResult.bookAuthorList.initList();
    } else {
      this.getStatCount();
      this.searchResult.caseList.param.bookCataId = null;
      this.searchResult.bookNameList.param.bookCataId = null;
      this.searchResult.bookAuthorList.param.bookCataId = null;
      this.searchResult.caseList.initList();
      this.searchResult.bookNameList.initList();
      this.searchResult.bookAuthorList.initList();
    }
  }

  getStatCount(data?: {
    bookCataId: string
  }) {
    this.http.getStatCount(data).subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.searchResult.caseList.searchResultNumber = res.data.caseCount;
        this.searchResult.bookNameList.searchResultNumber = res.data.bookNameCount;
        this.searchResult.bookAuthorList.searchResultNumber = res.data.bookAuthorCount;
      }
    });
  }

  caseContent(data: any) {
    this.caseItem = 'loading';
    this.http.getSection({
      articleId: data.caseId,
      bookName: data.title
    }).subscribe(res => {
      if (res.code == 0 && res.data && res.msg === 'ok') {
        this.caseItem = res.data;
      }
    });
  }
}
