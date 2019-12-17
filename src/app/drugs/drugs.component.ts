import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GlobeService } from '../service/globe.service';
import { DrugItemComponent } from '../drug-item/drug-item.component';

@Component({
  selector: 'app-drugs',
  templateUrl: './drugs.component.html',
  styleUrls: ['./drugs.component.scss']
})
export class DrugsComponent implements OnDestroy {
  destroy = [];
  // typeSearch = '饮片名';
  typeSearch:any = {};
  // searchInput = '';
  searchInput:any = {};
  dataList = [];

  constructor(private modal: NzModalRef,
    private nzModal: NzModalService,
    private globe: GlobeService) {
      this.dataList = globe.analysis;
    // modal.afterOpen.subscribe(() => {

    // })
  }

  search() {
    this.dataList = [...this.globe.analysis.filter(drug => {
      return (!this.searchInput['饮片名'] || drug['饮片名'].includes(this.searchInput['饮片名']))
           &&(!this.searchInput['同异名'] || drug['同异名'].includes(this.searchInput['同异名']))
           &&(!this.searchInput['概述'] || drug['概述'].includes(this.searchInput['概述']))
           &&(!this.searchInput['味'] || drug['味'].includes(this.searchInput['味']))
           &&(!this.searchInput['性'] || drug['性'].includes(this.searchInput['性']))
           &&(!this.searchInput['归经'] || drug['归经'].includes(this.searchInput['归经']))
           &&(!this.searchInput['功能'] || drug['功能'].includes(this.searchInput['功能']))
           &&(!this.searchInput['主治'] || drug['主治'].includes(this.searchInput['主治']))
           &&(!this.searchInput['功效'] || drug['功效'].includes(this.searchInput['功效']))
           &&(!this.searchInput['病症'] || drug['病症'].includes(this.searchInput['病症']))
           &&(!this.searchInput['病邪'] || drug['病邪'].includes(this.searchInput['病邪']))
           &&(!this.searchInput['病位'] || drug['病位'].includes(this.searchInput['病位']))
           &&(!this.searchInput['效用分析'] || drug['效用分析'].includes(this.searchInput['效用分析']))
           &&(!this.searchInput['用量'] || drug['用量'].includes(this.searchInput['用量']))
           &&(!this.searchInput['用法'] || drug['用法'].includes(this.searchInput['用法']));
    })];
  }

  ngOnDestroy() {
    this.destroy.forEach(item => {
      item.unsubscribe && item.unsubscribe();
      item.close && item.close();
    })
  }

  item(item: any) {
    let tplModal = this.nzModal.create({
      nzTitle: item['饮片名'],
      nzContent: DrugItemComponent,
      nzComponentParams: {
        edit: true,
        data: {
          ...item
        }
      },
      nzWidth: "85vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    tplModal.afterClose.subscribe((e: any) => {
      if (e) {
        this.globe.pushDrugsEditLoaclStorage({
          ...e, pre: {'饮片名': item['饮片名'], '同异名': item['同异名']}, old: (item.old || {'饮片名': item['饮片名'], '同异名': item['同异名']})
        });
        this.globe.pushDrugsEditFlag = true;
      }
    })
    this.destroy.push(tplModal);
  }

}
