export class Arabic {

  static zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  static unit = ['千', '百', '十', ''];
  static quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
  static zhDigit = [...Arabic.zh, ...Arabic.unit, ...Arabic.quot];

  /**
   * 获取字符串中的 数字 下标， 从指定下标 向前匹配
   * @param s 
   * @param endIndex 
   */
  static getArabicIndexForEnd(s: string, endIndex: number) {
    const index = s.length -1;
    if (index > -1 && endIndex > -1 && endIndex <= index && Arabic.zhDigit.includes(s[endIndex])) {
      const pre = Arabic.getArabicIndexForEnd(s, endIndex-1);
      if (pre) {
        return pre;
      } else {
        return {index: endIndex};
      }
    }
  }

    /**
   * 获取字符串中的 数字 下标， 从指定下标 向后匹配
   * @param s 
   * @param endIndex 
   */
  static getArabicIndexForStart(s: string, startIndex: number) {
    const index = s.length -1;
    if (index > -1 && startIndex > -1 && startIndex <= index && Arabic.zhDigit.includes(s[startIndex])) {
      const pre = Arabic.getArabicIndexForEnd(s, startIndex+1);
      if (pre) {
        return pre;
      } else {
        return {index: startIndex};
      }
    }
  }
  
  /**
   * 阿拉伯数字转中文数字,
   * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
   * 传入数字字符串则没有限制
   * @param {number|string} digit
   */
  static toZhDigit(digit) {
    digit = typeof digit === 'number' ? String(digit) : digit;
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unit = ['千', '百', '十', ''];
    const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

    let breakLen = Math.ceil(digit.length / 4);
    let notBreakSegment = digit.length % 4 || 4;
    let segment;
    let zeroFlag = [], allZeroFlag = [];
    let result = '';

    while (breakLen > 0) {
      if (!result) { // 第一次执行
        segment = digit.slice(0, notBreakSegment);
        let segmentLen = segment.length;
        for (let i = 0; i < segmentLen; i++) {
          if (segment[i] != 0) {
            if (zeroFlag.length > 0) {
              result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
              // 判断是否需要加上 quot 单位
              if (i === segmentLen - 1 && breakLen > 1) {
                result += quot[breakLen - 2];
              }
              zeroFlag.length = 0;
            } else {
              result += zh[segment[i]] + unit[4 - segmentLen + i];
              if (i === segmentLen - 1 && breakLen > 1) {
                result += quot[breakLen - 2];
              }
            }
          } else {
            // 处理为 0 的情形
            if (segmentLen == 1) {
              result += zh[segment[i]];
              break;
            }
            zeroFlag.push(segment[i]);
            continue;
          }
        }
      } else {
        segment = digit.slice(notBreakSegment, notBreakSegment + 4);
        notBreakSegment += 4;

        for (let j = 0; j < segment.length; j++) {
          if (segment[j] != 0) {
            if (zeroFlag.length > 0) {
              // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
              if (j === 0) {
                result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
              } else {
                result += '零' + zh[segment[j]] + unit[j];
              }
              zeroFlag.length = 0;
            } else {
              result += zh[segment[j]] + unit[j];
            }
            // 判断是否需要加上 quot 单位
            if (j === segment.length - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
          } else {
            // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
            if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
              result += quot[breakLen - 1];
              zeroFlag.length = 0;
              zeroFlag.push(segment[j]);
            } else if (allZeroFlag.length > 0) {
              // 执行到最后
              if (breakLen == 1) {
                result += '';
              } else {
                zeroFlag.length = 0;
              }
            } else {
              zeroFlag.push(segment[j]);
            }

            if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
              // 如果执行到末尾
              if (breakLen === 1) {
                allZeroFlag.length = 0;
                zeroFlag.length = 0;
                result += quot[breakLen - 1];
              } else {
                allZeroFlag.push(segment[j]);
              }
            }
            continue;
          }
        }


        --breakLen;
      }

      return result;
    }
  }
  static zhDigitToArabic(digit) {
    const zh = this.zh;
    const unit = this.unit;
    const quot = this.quot;
    let result = 0, quotFlag;

    for (let i = digit.length - 1; i >= 0; i--) {
      if (zh.indexOf(digit[i]) > -1) { // 数字
        if (quotFlag) {
          result += quotFlag * getNumber(digit[i]);
        } else {
          result += getNumber(digit[i]);
        }
      } else if (unit.indexOf(digit[i]) > -1) { // 十分位
        if (quotFlag) {
          result += quotFlag * getUnit(digit[i]) * getNumber(digit[i - 1]);
        } else {
          result += getUnit(digit[i]) * getNumber(digit[i - 1]);
        }
        --i;
      } else if (quot.indexOf(digit[i]) > -1) { // 万分位
        if (unit.indexOf(digit[i - 1]) > -1) {
          if (getNumber(digit[i - 1])) {
            result += getQuot(digit[i]) * getNumber(digit[i - 1]);
          } else {
            result += getQuot(digit[i]) * getUnit(digit[i - 1]) * getNumber(digit[i - 2]);
            quotFlag = getQuot(digit[i]);
            --i;
          }
        } else {
          result += getQuot(digit[i]) * getNumber(digit[i - 1]);
          quotFlag = getQuot(digit[i]);
        }
        --i;
      }
    }

    return result;

    // 返回中文大写数字对应的阿拉伯数字
    function getNumber(num) {
      for (let i = 0; i < zh.length; i++) {
        if (zh[i] == num) {
          return i;
        }
      }
    }

    // 取单位
    function getUnit(num) {
      for (let i = unit.length; i > 0; i--) {
        if (num == unit[i - 1]) {
          return Math.pow(10, 4 - i);
        }
      }
    }

    // 取分段
    function getQuot(q) {
      for (var i = 0; i < quot.length; i++) {
        if (q == quot[i]) {
          return Math.pow(10, (i + 1) * 4);
        }
      }
    }

  }
}
