import {FormControl} from '@angular/forms';

export class Validators {
  /**
   * required Check
   * @param {FormControl} control
   * @returns {{[p: string]: boolean}}
   */
  static required(control: FormControl): { [s: string]: boolean } {
    if (typeof control.value === 'string') {
      return control.value.replace(/\s/g, '').length === 0 ? {required: true} : null;
    } else if (control.value instanceof Array) {
      return control.value.length === 0 ? {required: true} : null;
    } else if (control.value === null) {
      return {required: true};
    } else {
      return null;
    }
  }

  /**
   * max length Check
   * @param len
   * @returns {(control: FormControl) => {maxlength: boolean}}
   */
  static maxLength(len: number):any {
    return (control: FormControl) => {
      if (control.value && (control.value + '').trim().length > len) {
        return {maxLength: true};
      }
    };
  }

  /**
   * min length Check
   * @param len
   * @returns {(control: FormControl) => {maxlength: boolean}}
   */
  static minLength(len: number): any {
    return (control: FormControl) => {
      if (control.value && (control.value + '').trim().length < len) {
        return {minLength: true};
      }
    };
  }

  /**
   * regexp check
   * @param len
   * @returns {(control: FormControl) => {maxlength: boolean}}
   */
  static regular(reg: any): any {
    return (control: FormControl) => {
      if (control.value) {
        return reg.test(control.value) ? null : {regular: true};
      }
    };
  }

  /**
   * telephone check
   * @param control: FormControl
   * @returns {(control: FormControl) => {maxlength: boolean}}
   */
  static phone(control: FormControl): { [s: string]: boolean } {
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (control.value) {
      return reg.test(control.value) ? null : {phone: true};
    }
  }

  /**
   * email check
   * */
  static email(control: FormControl): { [s: string]: boolean } {
    const reg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (control.value) {
      return reg.test(control.value) ? null : {email: true};
    }
  }

  /**
   * url check
   * @param control 
   */
  static UrlRegExp = new RegExp('^((https|http|ftp|rtsp|mms)?://)'
  +'?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp: user@
  + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP: URL- 199.194.52.184
  + '|' // IP and DOMAIN
  + '([0-9a-z_!~*()-]+.)*' // DOMAIN- www.
  + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // Two level domain
  + '[a-z]{2,6})' // first level domain- .com or .museum
  + '(:[0-9]{1,4})?' // port- :80
  + '((/?)|' // a slash isn't required if there is no file name
  + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$')
  static url(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      return Validators.UrlRegExp.test(control.value) ? null : {url: true};
    }
  }

  /**
   * IP check
   * */
  static ip(control: FormControl): { [s: string]: boolean } {
    const reg = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
    if (control.value) {
      return reg.test(control.value) ? null : {ip: true};
    }
  }

  /**
   * port check
   * */
  static port(control: FormControl): { [s: string]: boolean } {
    const reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    if (control.value) {
      return reg.test(control.value) ? null : {port: true};
    }
  }

  /**
   * check ...  reg = /^[\u0391-\uFFE5\w]+$/;
   * @param {FormControl} control
   * @returns {{[p: string]: boolean}}
   */
}
