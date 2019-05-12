import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/http.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-case-content',
  templateUrl: './case-content.component.html',
  styleUrls: ['./case-content.component.scss']
})
export class CaseContentComponent implements OnInit {
  case: any = {};
  constructor(private http: HttpService,
    private router: Router,
    private activateRoute: ActivatedRoute, ) { 
      if (http.contentItem) {
        http.getSection({
          articleId: http.contentItem.caseId,
          bookName: http.contentItem.bookName
        }).subscribe(res => {
          if (res.code==0&&res.data&&res.msg==="ok") {
            this.case = res.data
          }
        })
      } else {
        this.router.navigate(['../search'], {
          relativeTo: this.activateRoute
        });
      }
  }

  ngOnInit() {
  }

}
