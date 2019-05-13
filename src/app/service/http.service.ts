import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HttpUtil} from '../../shared/http-api/util';
import { Observable, Observer } from 'rxjs';

// import { Observable } from 'rxjs';
/**
 * Call interface API service
 */
@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getCategoryList() {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next({
          "code": "0",
          "data": [
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 1,
                  "byName": "内科医案",
                  "name": "内",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 126,
                  "byName": "外科医案",
                  "name": "外",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 170,
                  "byName": "妇科医案",
                  "name": "妇",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 223,
                  "byName": "儿科医案",
                  "name": "儿",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 289,
                  "byName": "五官科医案",
                  "name": "五官",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 371,
                  "byName": "皮肤科医案",
                  "name": "皮肤",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 400,
                  "byName": "眼科医案",
                  "name": "眼",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 529,
                  "byName": "肛肠科医案",
                  "name": "肛肠",
                  "parentId": 0
              },
              {
                  "cataList": [
                      {
                          "bookCataId": 42466,
                          "byName": "测试内容876h",
                          "cataList": [],
                          "name": "测试内容lhf2",
                          "numFound": 1
                      }
                  ],
                  "numFound": 1,
                  "bookCataId": 539,
                  "byName": "其它医案",
                  "name": "另",
                  "parentId": 0
              }
          ],
          "msg": "ok"
      });
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/getCategoryList');
    }
  }
  getStatCount(data?: {
    bookCataId: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next({
          "code": "0",
          "data": {
              "bookAuthorCount": 40,
              "bookNameCount": 45,
              "caseCount": 255
          },
          "msg": "ok"
      });
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/getStatCount', HttpUtil.setParams(data));
    }
  }
  getBookNameList(data: {
    bookCataId?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next({
          "code": "0",
          "data": {
              "list": [
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）阮怀清",
                      "bookId": 124,
                      "bookName": "阮氏医案",
                      "bookSource": "抄本（孤本）",
                      "bookYear": "1927"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "陆锦燧编",
                      "bookId": 123,
                      "bookName": "重古三何医案",
                      "bookSource": "1987年何希时校订本",
                      "bookYear": "1916"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）袁桂生",
                      "bookId": 122,
                      "bookName": "丛桂草堂医案",
                      "bookSource": "珍本医书集成本",
                      "bookYear": "1914"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）",
                      "bookId": 121,
                      "bookName": "孟河费绳甫先生医案",
                      "bookSource": "费承祖",
                      "bookYear": "1913"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）也是山人（待考）",
                      "bookId": 120,
                      "bookName": "也是山人医案",
                      "bookSource": "珍本医书集成本",
                      "bookYear": "1912"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）王堉",
                      "bookId": 119,
                      "bookName": "醉花窗医案",
                      "bookSource": "山西科学技术出版社1985年版",
                      "bookYear": "1911"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）沈鲁珍",
                      "bookId": 118,
                      "bookName": "沈氏医案",
                      "bookSource": "珍本医书集成本",
                      "bookYear": "1911"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）邵兰生",
                      "bookId": 117,
                      "bookName": "邵氏医案",
                      "bookSource": "珍本医书集成本",
                      "bookYear": "1911"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "佚名",
                      "bookId": 116,
                      "bookName": "上池医案",
                      "bookSource": "抄本",
                      "bookYear": "1911"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）鲁峰",
                      "bookId": 115,
                      "bookName": "鲁峰医案",
                      "bookSource": "清抄本",
                      "bookYear": "1911"
                  }
              ],
              "pageNum": 1,
              "pageSize": 10,
              "pages": 13,
              "total": 124
          },
          "msg": "ok"
      });
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/getBookNameList', HttpUtil.setParams(data));
    }
  }
  getBookAuthorList(data: {
    bookCataId?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next({
          "code": "0",
          "data": {
              "list": [
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）阮怀清"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "陆锦燧编"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）袁桂生"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）也是山人（待考）"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）王堉"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）沈鲁珍"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）邵兰生"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "佚名"
                  },
                  {
                      "caseCount": 95,
                      "bookAuthor": "（清）鲁峰"
                  }
              ],
              "pageNum": 1,
              "pageSize": 10,
              "pages": 13,
              "total": 124
          },
          "msg": "ok"
      });
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/book/getBookAuthorList', HttpUtil.setParams(data));
    }
  }
  getCaseList(data: {
    bookName?: string|number
    bookAuthor?: string|number
    bookCataId?: string|number
    pageNum: string|number
    pageSize: string|number
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next({
          "code": "0",
          "data": {
              "list": [
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 1,
                      "content": "\t一产妇咳嗽声重，鼻塞流涕，此风寒所感，余用参苏饮，一钟顿愈。与补中益气加桔梗、茯苓、半夏，一剂将痊。又与六君、黄芪，以实腠理全愈。",
                      "title": "校注妇人良方"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 2,
                      "content": "\t丹溪治金得，年三十八岁，面色青白，患伤风身热，大便不通。小柴胡汤加羌活、枳壳、桃仁、麻子仁各七分。此等案俱见症治病。",
                      "title": "名医类案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 3,
                      "content": "\t一人黑色，能饮酒，患伤风头疼、身疼如火热，骨痛无比，不吃饭。人参败毒散加干葛。",
                      "title": "名医类案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 4,
                      "content": "\t卢正一年四十五岁，患伤风腰疼，身热饮水。小柴胡汤加杜仲、牛膝、天花粉、连翘、干葛。",
                      "title": "名医类案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 5,
                      "content": "\t王成三患伤风，腹泻，百二十来度。五苓散加白术三钱，前胡八分，羌活一钱，风能胜湿。苍术二钱，神曲炒一钱。",
                      "title": "名医类案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 6,
                      "content": "\t方恺三患伤风，心疼。败毒散加山栀炒九分，白芍一钱五分，草豆蔻一钱五分，木香煨一钱。",
                      "title": "名医类案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 7,
                      "content": "\t祝显一患伤风，小便白浊无度。小柴胡汤加黄柏、知母、白术、芍药、当归各一钱，莲肉去心皮一钱，秋石八分。",
                      "title": "名医类案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 8,
                      "content": "\t考功偶冒风，头痛倦怠，发寒热如疟，脉弦浮而数。予曰：此小柴胡汤症也。一剂而瘥。",
                      "title": "孙文垣医案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 9,
                      "content": "王祖泉乃眷，朝饭后稍寒，恶风发热，遍身疼痛，汗大出不止，口中热，腹中不知饿，小水短，六脉皆涩。以白芍药五钱，白术二钱，桂皮、黄芩各一钱，甘草八分。二帖而汗止，寒热除，减去白术，加当归而遍身痛止。",
                      "title": "孙文垣医案"
                  },
                  {
                      "section": "测试内容84l0",
                      "source": "测试内容gb0v",
                      "caseId": 10,
                      "content": "东之丈令眷，妊已六月，为伤风咳嗽，腹中吊疼，痰壅，喉音不清，头且眩晕，脉左滑数，右寸弱，关滑，左尺有力，右尺弱。予以人参、白术、陈皮、贝母、茯苓、桔梗、桑白皮、紫苏、粉草、黄芩、前胡，四帖而病痊愈。",
                      "title": "孙文垣医案"
                  }
              ],
              "pageNum": 1,
              "pageSize": 10,
              "pages": 3514,
              "total": 35139
          },
          "msg": "ok"
      });
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/case/list', HttpUtil.setParams(data));
    }
  }
  // 医案内容
  contentItem: any = null;
  getSection(data: {
    articleId: string
    bookName: string
  }) {
    if (environment.mockData) {
      return new Observable((observer: Observer<any>) => {
        observer.next({
          "code": "0",
          "data": {
              "articleId": 2,
              "content": "时病论\t风温入肺胃误作阴虚腻补增剧\t云岫孙某，平素清癯，吸烟弱质，患咳嗽热渴，计半月矣。前医皆以为阴虚肺损，所服之药，非地、味、阿胶，即沙参、款、麦，愈治愈剧，始来求治于丰，按其脉，搏大有力，重取滑数，舌绛苔黄，热渴咳嗽，此明是风温之邪盘踞肺胃。前方尽是滋腻，益使气机闭塞，致邪不能达解，当畅其肺，清其胃，用辛凉解表法，加芦根、花粉治之。服二剂，胸次略宽，咳亦畅快，气分似获稍开，复诊其脉稍缓，但沉分依然，舌苔化燥而灰，身热如火，口渴不寐，此温邪之势未衰，津液被其所劫也。姑守旧法，减去薄荷，加入石膏、知母。服至第三剂，则肌肤微微汗润，体热退清，舌上津回，脉转缓怠，继以调补，日渐而安。\t风温误补致死\t里人范某，患风温时病，药石杂投，久延未愈。请丰诊视，视其形容憔悴，舌苔尖白根黄，脉来左弱右强，发热缠绵不已，咳嗽勤甚，痰中偶有鲜血，此乃赋禀素亏，风温时气未罄，久化为火，刑金劫络，理当先治其标，缓治其本，遂以银翘散，去荆芥、桔、豉，加川贝、兜、蝉，此虽治标，实不碍本，倘见血治血，难免不入虚途。病者信补不服，复请原医，仍用滋阴凉血补肺之方，另服人参、燕窝。不知温邪得补，益不能解，日累日深，竟成不起。呜呼！医不明标本缓急，误人性命，固所不免矣。\t风温夹湿\t南乡梅某，望七之年，素来康健，微热咳嗽，患有数朝，时逢农事方兴，犹是勤耕绿野，加冒春雨，则发热忽炽，咳嗽频频，口渴不甚引饮，身痛便泻。有谓春温时感，有言漏底伤寒，所进之方，佥未应手。延丰诊治，按其脉，濡数之形，舌苔黄而且腻，前恙未除，尤加胸闷溺赤，此系风温夹湿之证，上宜清畅其肺，中宜温化其脾，以辛凉解表法，去蒌壳，加葛根、苍术、神曲、陈皮治之。服二剂，身痛已除，便泻亦止，惟发热咳嗽，口渴喜凉，似乎客湿已解，温热未清，当步原章，除去苍术、神曲，加入绍贝、蒌根、芦根、甘草。迭进三剂，则咳嗽渐疏，身热退净。复诊数次，诸恙若失矣。（临证治案一）",
              "section": "风温案",
              "title": "时病论"
          },
          "msg": "ok"
      });
        observer.complete();
      });
    } else {
      return this.http.get<any>(environment.api + '/case/getSection', HttpUtil.setParams(data));
    }
  }
}
