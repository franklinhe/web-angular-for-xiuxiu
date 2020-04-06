import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExcelService } from 'src/shared/excel/excel';
import { Arabic } from 'src/shared/util/arabic';
import { LocalStorageSetTime } from 'src/shared/util/local-storage-set-time';

@Injectable()
export class GlobeService {

  drugsAddLoaclStorage: any[] = LocalStorageSetTime.getItem('drugsAdd') || [];
  drugsEditLoaclStorage: any = LocalStorageSetTime.getItem('drugsEdit') || {};
  unitOtherLoaclStorage: any[] = LocalStorageSetTime.getItem('unitOther') || [];
  analysis = [];
  sorts: any = {};
  drugs: any = {};
  units: any = {};
  unitList: any[] = [];
  unitOtherList = [];
  prescription = {
    '方剂': [],
    '同异名': [],
    map: {}
  };

  pushDrugsEditFlag;

  constructor(private http: HttpClient) {
    http.get('./assets/data.xlsx', { responseType: 'blob' }).subscribe((file) => {
      ExcelService.import(file, [{
        index: 0, header: 2 // 饮片名	同异名	概述	味	性	归经	功能	主治	功效	病症	病邪	病位	效用分析	用量	用法
      }, {
        index: 1, header: 2 // 功效	病邪	病邪顺序	病症	病位	病位顺序
      }, {
        index: 2, header: 2 // 药性顺序	药味顺序	归经顺序
      }, {
        index: 3, header: 2 // 单位	换算	标准单位	单位简写
      }, {
        index: 4, header: 2 // 其他单位	换算	标准单位	单位简写
      }, {
        index: 5, header: 2 // 参数	值	说明	用途
      }, {
        index: 6, header: 2 // 方名 同异名
      }]).subscribe((data: [][]) => {
        // // 饮片名	同异名	概述	味	性	归经	功能	主治	功效	病症	病邪	病位	效用分析	用量	用法
        [...data[0], ...this.drugsAddLoaclStorage].map((d: any) => {
          this.analysis.push(d);
          this.drugs[d['饮片名']] = d;
          d['同异名'].split("、").filter((s: string) => s.length > 0).map((n: string) => {
            this.drugs[n] = d;
          });
        })
        // 同步本地修改结果
        for (const key in this.drugsEditLoaclStorage) {
          if (this.drugsEditLoaclStorage.hasOwnProperty(key)) {
            this.pushDrugsEditLoaclStorage(this.drugsEditLoaclStorage[key]);
          }
        }
        // 功效	病邪	病邪顺序	病症	病位	病位顺序
        data[1].filter((s: any) => s['病邪顺序'] && s['病邪顺序'].length > 0).map((d: any) => {
          this.sorts['病邪顺序'] = this.sorts['病邪顺序'] ? [...this.sorts['病邪顺序'], d['病邪顺序']] : [d['病邪顺序']];
        })
        data[1].filter((s: any) => s['病位顺序'] && s['病位顺序'].length > 0).map((d: any) => {
          this.sorts['病位顺序'] = this.sorts['病位顺序'] ? [...this.sorts['病位顺序'], d['病位顺序']] : [d['病位顺序']];
        })
        data[1].filter((s: any) => s['功效'] && s['功效'].length > 0).map((d: any) => {
          this.sorts['功效'] = this.sorts['功效'] ? [...this.sorts['功效'], d['功效']] : [d['功效']];
        })
        data[1].filter((s: any) => s['病症'] && s['病症'].length > 0).map((d: any) => {
          this.sorts['病症'] = this.sorts['病症'] ? [...this.sorts['病症'], d['病症']] : [d['病症']];
        })
        // 药性顺序	药味顺序	归经顺序
        data[2].filter((s: any) => s['药性顺序'] && s['药性顺序'].length > 0).map((d: any) => {
          this.sorts['药性顺序'] = this.sorts['药性顺序'] ? [...this.sorts['药性顺序'], d['药性顺序']] : [d['药性顺序']];
        })
        data[2].filter((s: any) => s['药味顺序'] && s['药味顺序'].length > 0).map((d: any) => {
          this.sorts['药味顺序'] = this.sorts['药味顺序'] ? [...this.sorts['药味顺序'], d['药味顺序']] : [d['药味顺序']];
        })
        data[2].filter((s: any) => s['药性顺序'] && s['药性顺序'].length > 0).map((d: any) => {
          this.sorts['归经顺序'] = this.sorts['归经顺序'] ? [...this.sorts['归经顺序'], d['归经顺序']] : [d['归经顺序']];
        })
        // 单位	换算	标准单位	单位简写
        data[3].map((d: any) => {
          this.unitList.push({
            name: d['单位'],
            count: d['换算'],
            nuit: d['标准单位'],
            nuitChar: d['单位简写']
          })
        })
        // 其他单位	换算	标准单位	单位简写
        data[4].map((d: any) => {
          this.unitOtherList.push({
            name: d['其他单位'],
            count: d['换算'],
            nuit: d['标准单位'],
            nuitChar: d['单位简写']
          })
        })
        this.unitOtherList = [...this.unitOtherList, ...this.unitOtherLoaclStorage];
        this.unitsToMap()
        // 参数	值	说明	用途
        data[5].map((d: any) => {
          switch (d['参数']) {
            case '前端数据暂存时间':
              LocalStorageSetTime.time = eval(d['值']);
              break;
            default:
              break;
          }
        })
        // 方名 同异名
        data[6].map((d: any) => {
          this.prescription.方剂.push(d['方名'])
          d['同异名'] && d['同异名'].split('、').forEach(p => {
            if (p) {
              this.prescription.同异名.push(p)
              this.prescription.map[p] = d['方名']
            }
          });
        })
      })
    })
  }

  unitsToMap() {
    LocalStorageSetTime.setItem('unitOther', this.unitOtherLoaclStorage);
    this.unitOtherList.concat(this.unitList).map(u => {
      u.count = parseFloat(u.count);
      this.units[u.name] = u;
    });
  }

  pushDrugsAddLoaclStorage(item: any) {
    this.drugsAddLoaclStorage.push(item);
    this.analysis.push(item);
    this.drugs[item['饮片名']] = item;
    item['同异名'] && item['同异名'].split("、").map((n: string) => {
      this.drugs[n] = item;
    });
    LocalStorageSetTime.setItem('drugsAdd', this.drugsAddLoaclStorage);
  }

  pushDrugsEditLoaclStorage(item: {
    old: { '饮片名': string, '同异名': string }, pre: { '饮片名': string, '同异名': string }
  }) {
    // 修改 先去掉原有的
    if (item.pre) {
      // 修改内存中的变量
      Object.assign(this.drugs[item.pre['饮片名']], item);
      // 删除 脏数据
      delete this.drugsEditLoaclStorage[item.pre['饮片名']];
      item.pre['同异名'].split("、").filter((s: string) => s.length > 0).map((n: string) => {
        delete this.drugsEditLoaclStorage[n];
      });
    }
    if (item.old) {
      // 修改内存中的变量
      Object.assign(this.drugs[item.old['饮片名']], item);
      // 删除 脏数据
      delete this.drugsEditLoaclStorage[item.old['饮片名']];
      item.old['同异名'].split("、").filter((s: string) => s.length > 0).map((n: string) => {
        delete this.drugsEditLoaclStorage[n];
      });
    }
    // 再 加入现在的
    this.drugsEditLoaclStorage[item['饮片名']] = this.drugs[item.old['饮片名']];
    this.drugs[item['饮片名']] = this.drugs[item.old['饮片名']];
    item['同异名'].split("、").filter((s: string) => s.length > 0).map((n: string) => {
      this.drugsEditLoaclStorage[n] = this.drugs[item.old['饮片名']];
      this.drugs[n] = this.drugs[item.old['饮片名']];
    });
    LocalStorageSetTime.setItem('drugsEdit', this.drugsEditLoaclStorage);
  }

  // 原文分析
  caseContent(content: string, flag: { type: 'article' | 'case', id: string }) {
    let analysis: any[], contents: any[], contentsAndanalysis: any[];
    // 原文 拆分 成 句
    const conts = content.split('。');
    conts.filter(c => c).forEach((text: string) => {
      text = text.replace(/<[^<>]+>/g, "");
      text = text.replace(new RegExp('&nbsp;', 'g'), " ");
      // analy.text = analy.text.match(/[\u4e00-\u9fa5]/g).join("");
      const analy: any = this.casePart(text, flag);
      if (analy) {
        analy.text = text;
        analysis = (analysis ? [...analysis, analy] : [analy]);
        contentsAndanalysis = (contentsAndanalysis ? [...contentsAndanalysis, analy] : [analy]);
      } else if (text) {
        contentsAndanalysis = (contentsAndanalysis ? [...contentsAndanalysis, text] : [text]);
      }
      contents = (contents ? [...contents, text] : [text]);
    })
    return {
      analysis, contents, contentsAndanalysis
    }
  }

  // 段落 句子 分析
  casePart(text: string, flag: { type: 'article' | 'case', id: string }) {
    // 获取文本中的 方剂
    const prescriptionAnalysis = this.getPrescription(text, flag, text);
    // 获取文本中的 药品 信息 、 用量
    let analysis = this.getAnaly(text, flag, text);
    // content: 按关键词拆分文本=>用于页面显示点击时间 , drugs 从原文中匹配到的药品名称
    let content: string[], drugs = [], prescription = [];
    prescriptionAnalysis.forEach((pres: any) => {
      if (pres.getNameByContent) {
        analysis = analysis.filter(drug => pres.getNameByContent.indexOf(drug.getNameByContent) == -1)
        prescription.push(pres.getNameByContent);
        text = text.replace(new RegExp(pres.getNameByContent, 'g'), '(^$#@!*)' + pres.getNameByContent + '(^$#@!*)');
        if (pres.getCountByContent && pres.getCountByContent.countContent) {
          text = text.replace(new RegExp(pres.getCountByContent.countContent, 'g'), `<span class="text-primary-static">${pres.getCountByContent.countContent}</span>`);
        }
      }
    })
    analysis.forEach((drug: any) => {
      if (drug.getNameByContent) {
        drugs.push(drug.getNameByContent);
        text = text.replace(new RegExp(drug.getNameByContent, 'g'), '(^$#@!*)' + drug.getNameByContent + '(^$#@!*)');
        if (drug.getCountByContent && drug.getCountByContent.countContent) {
          text = text.replace(new RegExp(drug.getCountByContent.countContent, 'g'), `<span class="text-primary-static">${drug.getCountByContent.countContent}</span>`);
        }
      }
    });
    content = text.split('(^$#@!*)').filter(c => c);
    //原文按关键词拆分[],匹配到的药品[],从原文中匹配到的药品字符串[],
    if (content.length) {
      return { content, analysis, drugs, prescription, prescriptionAnalysis };
    }
    // return {content: [text], analysis: [], drugs: []}
  }

  // 获取文本中的 方剂
  getPrescription(text: string, flag: { type: 'article' | 'case', id: string }, text_: string): any[] {
    // 匹配到的方剂
    let datas = [];
    let reg = [...this.prescription.方剂, ...this.prescription.同异名]
      .filter((i: string) => i.length > 0)
      .sort((a: string, b: string) => b.length - a.length)
      .join('|')
    const analy = text.match(new RegExp(reg));
    // 药品匹配结果 [value]|{index, input:text}
    if (analy) {
      // 取匹配的药材后面的字符串,获取药材后面的数量单位|用量
      let getCountByContent: any = this.getCount(text.substr(analy.index + analy[0].length));
      datas.push({
        name: this.prescription.map[analy[0]] || analy[0],
        getNameByContent: analy[0],
        getAnalyByContent: analy,
        getCountByContent
      });
      // 查找 下一味 药材
      const getNext = this.getPrescription(text.substr(analy.index + analy[0].length), flag, text_);
      if (getNext) {
        return datas.concat(getNext);
      } else {
        return datas;
      }
    } else {
      return datas;
    }
  };

  // 获取文本中的 药品 信息 、 用量
  getAnaly(text: string, flag: { type: 'article' | 'case', id: string }, text_: string): any[] {
    // 匹配到的药品
    let drugs = [];
    // 在句子中 用 药名 globe.analysis 匹配药品 名称|analy:[string]{index, input|原文}
    const reg = this.analysis.reduce((drugA, drugB) => {
      if (Array.isArray(drugA)) {
        return drugA.concat([drugB['饮片名']].concat(drugB['同异名'].split("、")));
      } else {
        return [drugB['饮片名']].concat(drugB['同异名'].split("、")).concat([drugA['饮片名']].concat(drugA['同异名'].split("、")));
      }
    }).filter((i: string) => i.length > 0).sort((a: string, b: string) => b.length - a.length).join("|");
    const analy = text.match(new RegExp(reg));
    // 药品匹配结果 [value]|{index, input:text}
    if (analy) {
      // 取匹配的药材后面的字符串,获取药材后面的数量单位|用量
      let getCountByContent: any = this.getCount(text.substr(analy.index + analy[0].length));
      const flagCount = this.drugs[analy[0]].flag
        && this.drugs[analy[0]].flag[flag.type]
        && this.drugs[analy[0]].flag[flag.type][flag.id]
        && this.drugs[analy[0]].flag[flag.type][flag.id][text_]
      if (getCountByContent && flagCount) {
        getCountByContent.count = flagCount;
      } else if (flagCount) {
        getCountByContent = { count: flagCount };
      };
      drugs.push({
        ...this.drugs[analy[0]], // 药品信息
        getNameByContent: analy[0],
        getAnalyByContent: analy,
        getCountByContent
      });
      // 查找 下一味 药材
      const nextDrugs = this.getAnaly(text.substr(analy.index + analy[0].length), flag, text_);
      if (nextDrugs) {
        return drugs.concat(nextDrugs);
      } else {
        return drugs;
      }
    } else {
      return drugs;
    }
  };

  /**
   * 获取用量
   * */
  getCount(analySting: string) {
    const reg = [...this.unitList, ...this.unitOtherList].sort((a, b) => (a.length - b.length))
      .map(u => u.name).sort((a, b) => (b.length - a.length)).join('|');
    // 取 药材 后面 匹配 到的 计量单位
    let getCount = analySting.match(new RegExp(reg));
    /**
     * 在句子中 用 globe.unitList、globe.unitOtherList 匹配药品
     * 用量|getCount:[value:string|计量单位]{index, iniput:analySting} 
     * */
    if (getCount) {
      // count 转换后的用量，countContent 原文中的用量
      let count = 1, countContent = getCount[0];
      // 在 计量单位字符 前 获取 数量
      const countStartIndex = Arabic.getArabicIndexForEnd(analySting, getCount.index - 1);
      if (countStartIndex) { // 一斤
        countContent = analySting.substring(countStartIndex.index, getCount.index + getCount[0].length);
        count = Arabic.zhDigitToArabic(countContent) * this.units[getCount[0]].count;
      } else if (analySting[getCount.index - 1] === '半') { // 半斤
        countContent = '半' + countContent;
        count = this.units[getCount[0]].count / 2;
      } else { // 斤半
        count = this.units[getCount[0]].count;
      }
      // 分析 计量单位字符 后 的字符 （一两一钱一分半）
      const countEndIndex = Arabic.getArabicIndexForStart(analySting, getCount.index + getCount[0].length);
      if (countEndIndex) { // 一两一
        const nextUnit = analySting.substr(countEndIndex.index + 1).match(new RegExp(reg));
        if (nextUnit && nextUnit.index === 0) { // 一两一钱
          const nextCount = this.getCount(analySting.substr(getCount.index + 1));
          if (nextCount) { // 一斤一两一钱一分 or 一两一钱 or 一两一钱
            countContent = countContent + nextCount.countContent;
            count = count + nextCount.count;
          }
        } else {
          countContent = countContent + analySting.substring(getCount.index + getCount[0].length, countEndIndex.index + 1);
          count = count + Arabic.zhDigitToArabic(analySting.substring(getCount.index + getCount[0].length, countEndIndex.index + 1)) / 10;
        }
      } else if (
        (analySting[getCount.index + 1] === '半')
        || (analySting[getCount.index + 1] === '加')
      ) { // 一分半 || 一斤半两三分
        const nextUnit = analySting.substr(getCount.index + 2).match(new RegExp(reg));
        if (nextUnit && nextUnit.index === 0) { // 一两一钱
          const nextCount = this.getCount(analySting.substr(getCount.index + 1));
          if (nextCount) { // 一斤一两一钱一分 or 一两一钱 or 一两一钱
            countContent = countContent + nextCount.countContent;
            count = count + nextCount.count;
          }
        } else {
          countContent = countContent + '半';

          // todo 斤半 === 一斤半 ？
          // if (countStartIndex) {
          let a = this.units[getCount[0]].count, b = a / 2;
          count = count + (this.units[getCount[0]].count / 2);
          // } else {
          // count = this.units[getCount[0]].count / 2;
          // }
        }
      }
      return {
        count: parseFloat(count.toFixed(5)), // 用量 g
        countContent // 原文中匹配到的用量信息
      }
    }
  }

}
