import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GlobeService } from '../service/globe.service';
import { MessageService } from 'src/shared/message/message.service';

@Component({
  selector: 'app-drug-item',
  templateUrl: './drug-item.component.html',
  styleUrls: ['./drug-item.component.scss']
})
export class DrugItemComponent implements OnDestroy, OnInit {
  @Input()
  flag: {
    type: 'article' | 'case',
    id: string
    [prop:string]: any
  }
  @Input()
  data: {
    flag?: any
    StandardUnitChar?: string
    [prop:string]: any
  };
  @Input()
  edit = false;
  @Input()
  analy = false;
  destroy = [];

  constructor(private modal: NzModalRef,
    private nzModal: NzModalService,
    private msg: MessageService,
    private globe: GlobeService) {
      modal.afterOpen.subscribe(() => {

      })
  }

  ngOnInit() {
    if (this.flag) {
      const flagCount = this.data
                        &&this.data.getCountByContent
                        &&this.data.getCountByContent.count || '';
      if (this.data.flag) {
        if (this.data.flag[this.flag.type]) {
          if (this.data.flag[this.flag.type][this.flag.id]) {
            if (!this.data.flag[this.flag.type][this.flag.id][this.flag.data.text]) {
              this.data.flag[this.flag.type][this.flag.id][this.flag.data.text] = flagCount;
            }
          } else {
            this.data.flag[this.flag.type][this.flag.id] = {
              // text
              [this.flag.data.text]: flagCount
            }
          }
        } else {
          this.data.flag[this.flag.type] = {
            // 'articleId' | 'caseId',
            [this.flag.id]: {
              // text
              [this.flag.data.text]: flagCount
            }
          }
        }
      } else {
        this.data.flag = {
          // 'article' | 'case',
          [this.flag.type]: {
            // 'articleId' | 'caseId',
            [this.flag.id]: {
              // text
              [this.flag.data.text]: flagCount
            }
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroy.forEach(item => {
      item.unsubscribe && item.unsubscribe();
      item.close && item.close();
    })
  }

  ok() {

    this.modal.destroy(this.data);
  }

}
