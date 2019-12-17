import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { GlobeService } from '../service/globe.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  count: number;
  addName = '';
  addCount = '';

  constructor(private modal: NzModalRef,
              public globe: GlobeService) {
                this.count = globe.units['两'].count;
  }

  ngOnInit() {
  }

  change(value: string) {
    this.modal['edit']=true;
    const count = parseFloat(value)||0;
    // this.globe.units['斤'].count = count*16;
    this.globe.units['斤'].count = parseFloat((count*10).toFixed(5));
    this.globe.units['两'].count = parseFloat((count).toFixed(5));
    this.globe.units['钱'].count = parseFloat((count/10).toFixed(5));
    this.globe.units['分'].count = parseFloat((count/100).toFixed(5));
  }

  add() {
    if (this.addName && this.addCount) {
      const o = {
        name: this.addName,
        count: parseFloat(this.addCount),
        nuit: '克',
        nuitChar: 'g'
      };
      this.globe.unitOtherList.push(o);
      this.globe.unitOtherLoaclStorage.push(o);
      this.addName = '';
      this.addCount = '';
    }
  }
 
}
