import { Component, Input, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GlobeService } from '../service/globe.service';
import { TableListModel } from 'src/shared/table-list/table-list-model';
import { DrugsComponent } from '../drugs/drugs.component';
import { UnitComponent } from '../unit/unit.component';
import { DrugItemComponent } from '../drug-item/drug-item.component';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'src/shared/message/message.service';
import { HttpService } from '../service/http.service';
declare let $:any;

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnDestroy {
  @Input()
  data: any;
  @Input()
  item: any;
  @ViewChild('textareaedit') ele: ElementRef;

  destroy = [];
  analysis = new TableListModel();
  drugsList = [];
  evilsList = [];
  diseaseList = [];
  propertyList = [];
  flavorList = [];
  tropismList = [];
  effectList = [];
  maladyList = [];

  status = 'loading';

  constructor(private modal: NzModalRef,
    private nzModal: NzModalService,
    private msg: MessageService,
    private http: HttpService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public globe: GlobeService) {
    modal.afterOpen.subscribe(() => {
      this.getContentPart(this.data);
    })
  }

  ngOnDestroy() {
    this.destroy.forEach(item => {
      item.unsubscribe && item.unsubscribe();
      item.close && item.close();
    })
  }

  drugs() {
    let tplModal = this.nzModal.create({
      nzTitle: `药品信息`,
      nzContent: DrugsComponent,
      nzComponentParams: {},
      nzWidth: "95vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });    
    this.destroy.push(tplModal);
  }

  drug(item: any) {
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
        this.status = 'loading';
        this.analysis.list = [];
        setTimeout(() => { this.getContentPart(this.data) }, 500);
      }
    })
    this.destroy.push(tplModal);
  }

  addDrug(item: any) {
    let tplModal = this.nzModal.create({
      nzTitle: '添加',
      nzContent: DrugItemComponent,
      nzComponentParams: {
        edit: true,
        data: {
          '同异名': '',
          '用量': '2~10'
        }
      },
      nzWidth: "85vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    tplModal.afterClose.subscribe((e: any) => {
      if (e) {
        this.globe.pushDrugsAddLoaclStorage(e);
        this.status = 'loading';
        this.analysis.list = [];
        setTimeout(() => { this.getContentPart(this.data) }, 500);
      }
    })
  }

  editDrug(item: any, data: any, index: number) {
    let article: boolean, id: string;
    if (this.item['articleId']) {
      article = true;
      id = this.item['articleId'];
    } else {
      article = false;
      id = this.item['caseId']
    }
    let tplModal = this.nzModal.create({
      
      nzContent: DrugItemComponent,
      nzComponentParams: {
        flag: {
          type: (this.item['articleId'] ? 'article' : 'case'), 
          id: (this.item['articleId'] ? this.item['articleId'] : this.item['caseId']), 
          data
        },
        edit: true,
        analy: true,
        data: {
          ...item,
          StandardUnitChar: 'g'
        }
      },
      nzWidth: "50vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    tplModal.afterClose.subscribe((e: any) => {
      if (e) {
        e.flag[(article ? 'article' : 'case')][id][data.text] = parseFloat(e.flag[(article ? 'article' : 'case')][id][data.text]);
        this.globe.pushDrugsEditLoaclStorage({
          ...e, pre: {'饮片名': item['饮片名'], '同异名': item['同异名']}, old: (item.old || {'饮片名': item['饮片名'], '同异名': item['同异名']})
        });
        this.textEdit(data, index);
        // this.analy();
        // this.status = 'loading';
        // // this.analysis.list = [];
        // setTimeout(() => { 
        //   // this.getContentPart(this.data)
        //   this.textEdit(data, index);
        //   this.analy();
        // }, 500);
      }
    })
    this.destroy.push(tplModal);
  }

  deleteDrug(index: number, data: any) {
    data.analysis.splice(index, 1);
    this.analy();
  };

  drugByName(name: string) {
    const item = this.globe.drugs[name];
    let tplModal = this.nzModal.create({
      nzTitle: item['饮片名'],
      nzContent: DrugItemComponent,
      nzComponentParams: {
        data: item
      },
      nzWidth: "85vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    tplModal.afterClose.subscribe((e: any) => {
      if (this.globe.pushDrugsEditFlag) {
        this.globe.pushDrugsEditFlag = false;
        this.status = 'loading';
        this.analysis.list = [];
        setTimeout(() => { this.getContentPart(this.data) }, 500);
      }
    })
    this.destroy.push(tplModal);
  }

  unit() {
    let tplModal = this.nzModal.create({
      nzTitle: `计量换算`,
      nzContent: UnitComponent,
      nzComponentParams: {},
      nzWidth: "60vw",
      nzWrapClassName: "vertical-center-modal",
      nzFooter: null
    });
    tplModal.afterClose.subscribe(() => {
      this.status = 'loading';
      this.globe.unitsToMap();
      this.analysis.list = [];
      setTimeout(() => { this.getContentPart(this.data) }, 500);
    })
    this.destroy.push(tplModal);
  }

  getContentPart(content: string) {
    let analysis = this.globe.caseContent(content, {type: (this.item['articleId'] ? 'article' : 'case'), 
    id: (this.item['articleId'] ? this.item['articleId'] : this.item['caseId'])});
    if (analysis.analysis) {
      this.analysis.list = analysis.analysis;
      // 全部选中
      this.analysis.allChecked = true;
      this.analysis.checkedAll(true);
      // 分析
      this.analy();
      this.status = 'list';
    } else {
      // this.status = 'none';                               ';
      this.analysis.list = [{none: true, text: '', analysis: []}];
      // 全部选中
      this.analysis.allChecked = true;
      this.analysis.checkedAll(true);
      // 分析
      this.analy();
      this.status = 'list';
    }
  }
  noneEdit(data: any, index: number) {
    const anay = this.globe.casePart(data.text, {type: (this.item['articleId'] ? 'article' : 'case'), 
      id: (this.item['articleId'] ? this.item['articleId'] : this.item['caseId'])}
    );
    if (anay) {
      data.analysis = anay.analysis;
    } else {
      data.analysis = [];
    }
    this.analy();
  }

  editText(data: any) {
    data.edit = true;
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.ele.nativeElement.focus();
      }
    }, 200);
  }

  textEdit(data: any, index: number) {
    data.edit = false;
    this.analysis.checked(false, data);
    this.analysis.list[index] = this.globe.casePart(data.text, {type: (this.item['articleId'] ? 'article' : 'case'), 
    id: (this.item['articleId'] ? this.item['articleId'] : this.item['caseId'])}) || {
      analysis: []
    };
    this.analysis.list[index].text = data.text;
    this.analysis.list[index].checked = true;
    this.analysis.checked(true, this.analysis.list[index]);
    this.analysis.list = [...this.analysis.list];
    this.analy();
  }

  addAnaly(data: any) {
    if (!data.addDrug) {
      this.msg.warning('请选择药材！')
      return;
    }
    if (!data.addCount) {
      this.msg.warning('请输入用量！')
      return;
    }
    data.analysis.push({
      ...data.addDrug,
      getNameByContent: data.addDrug['饮片名'],
      getCountByContent: {count: parseFloat(data.addCount)}
    });
    this.analy();
    data.addDrug = null;
    data.addCount = ''
  }
 // 分析
 analy() {
  // 获取 药品
  let drugs = {}, evils = {}, disease = {}, property = {}, flavor = {}, tropism = {}, effect = {}, malady = {}, txt='',
    drugsList = [], evilsList = [], diseaseList = [], propertyList = [], flavorList = [], tropismList = [], effectList = [], maladyList = [];
  this.analysis.checkedList.forEach((analy: any) => {
    analy.analysis.forEach((drug: any) => {
      if (drug.getCountByContent) {
        if (drugs[drug.getNameByContent]) {
          drugs[drug.getNameByContent].totalCount += drug.getCountByContent.count;
        } else {
          drugs[drug.getNameByContent] = {
            ...this.globe.drugs[drug.getNameByContent],
            totalCount: drug.getCountByContent.count
          };
        }
      }
    })
    // 方剂
    analy.prescriptionAnalysis.forEach((drug: any) => {
      if (drug.getCountByContent) {
        // if (drugs[drug.getNameByContent]) {
        //   drugs[drug.getNameByContent].totalCount += drug.getCountByContent.count;
        // } else {
        //   drugs[drug.getNameByContent] = {
        //     ...this.globe.drugs[drug.getNameByContent],
        //     totalCount: drug.getCountByContent.count
        //   };
        // }
      }
    })
  });
  for (const drug in drugs) {
    txt = txt + drug+ ':' + drugs[drug].totalCount+',';
  }
  this.http.getModel({txt:txt.substr(0, txt.length-1)}).subscribe(res => {
    if (res.code === '-1') {
      return;
    }
      let result =JSON.parse(res);
      evils = result.bingx;
      disease = result.bingw;
      property = result.xing;
      flavor = result.wei;
      tropism = result.guij;
      effect = result.gongx;
      malady = result.bingz;
      for (const key in evils) {
        if (evils.hasOwnProperty(key)) {
          evilsList.push({
            ...evils[key],
            name: key
          });
        }
      }
      for (const key in disease) {
        if (disease.hasOwnProperty(key)) {
          diseaseList.push({
            ...disease[key],
            name: key
          });
        }
      }
      for (const key in property) {
        if (property.hasOwnProperty(key)) {
          propertyList.push({
            ...property[key],
            name: key
          });
        }
      }
      for (const key in flavor) {
        if (flavor.hasOwnProperty(key)) {
          flavorList.push({
            ...flavor[key],
            name: key
          });
        }
      }
      for (const key in tropism) {
        if (tropism.hasOwnProperty(key)) {
          tropismList.push({
            ...tropism[key],
            name: key
          });
        }
      }
      for (const key in effect) {
        if (effect.hasOwnProperty(key)) {
          effectList.push({
            ...effect[key],
            name: key
          });
        }
      }
      for (const key in malady) {
        if (malady.hasOwnProperty(key)) {
          maladyList.push({
            ...malady[key],
            name: key
          });
        }
      }
      this.drugsList = [];
      this.evilsList = []; // 病邪分析
      this.diseaseList = []; // 病位分析
      this.propertyList = []; // 药性分析
      this.flavorList = []; // 药味分析
      this.tropismList = []; // 归经分析
      this.effectList = []; // 功效分析
      this.maladyList = []; // 病症分析
      this.drugsList = drugsList;
      this.evilsList = evilsList.sort((a: any, b: any) => {
        return this.globe.sorts['病邪顺序'].indexOf(a.name) - this.globe.sorts['病邪顺序'].indexOf(b.name)
      });
      this.diseaseList = diseaseList.sort((a: any, b: any) => {
        return this.globe.sorts['病位顺序'].indexOf(a.name) - this.globe.sorts['病位顺序'].indexOf(b.name)
      });
      this.propertyList = propertyList.sort((a: any, b: any) => {
        return this.globe.sorts['药性顺序'].indexOf(a.name) - this.globe.sorts['药性顺序'].indexOf(b.name)
      });
      this.flavorList = flavorList.sort((a: any, b: any) => {
        return this.globe.sorts['药味顺序'].indexOf(a.name) - this.globe.sorts['药味顺序'].indexOf(b.name)
      });
      this.tropismList = tropismList.sort((a: any, b: any) => {
        return this.globe.sorts['归经顺序'].indexOf(a.name) - this.globe.sorts['归经顺序'].indexOf(b.name)
      });
      this.effectList = effectList.sort((a: any, b: any) => {
        return this.globe.sorts['功效'].indexOf(a.name) - this.globe.sorts['功效'].indexOf(b.name)
      });
      this.maladyList = maladyList.sort((a: any, b: any) => {
        return this.globe.sorts['病症'].indexOf(a.name) - this.globe.sorts['病症'].indexOf(b.name)
      });
    }
  );

 }
 
showName(name: string, item: any) {
  return name.replace(item.getNameByContent, `<span class="text-warning">${item.getNameByContent}</span>`);
}

sort(e: { key: string, value: 'descend' | 'ascend' }, data: [], key: string) {
  if (e.value) {
    this[key] = [...data.sort((a: any, b: any) => {
      if (e.value === 'ascend') {
        return parseFloat(a[e.key]) - parseFloat(b[e.key]);
      }
      return parseFloat(b[e.key]) - parseFloat(a[e.key]);
    })];
  } else {
    switch (key) {
      case 'evilsList':
        this.evilsList = this.evilsList.sort((a: any, b: any) => {
          return this.globe.sorts['病邪顺序'].indexOf(a.name) - this.globe.sorts['病邪顺序'].indexOf(b.name)
        });
        break;
      case 'diseaseList':
        this.diseaseList = this.diseaseList.sort((a: any, b: any) => {
          return this.globe.sorts['病位顺序'].indexOf(a.name) - this.globe.sorts['病位顺序'].indexOf(b.name)
        });
        break;
      case 'propertyList':
        this.propertyList = this.propertyList.sort((a: any, b: any) => {
          return this.globe.sorts['药性顺序'].indexOf(a.name) - this.globe.sorts['药性顺序'].indexOf(b.name)
        });
        break;
      case 'flavorList':
        this.flavorList = this.flavorList.sort((a: any, b: any) => {
          return this.globe.sorts['药味顺序'].indexOf(a.name) - this.globe.sorts['药味顺序'].indexOf(b.name)
        });
        break;
      case 'tropismList':
        this.tropismList = this.tropismList.sort((a: any, b: any) => {
          return this.globe.sorts['归经顺序'].indexOf(a.name) - this.globe.sorts['归经顺序'].indexOf(b.name)
        });
        break;
      default:
        break;
    }
  }
 }
}
