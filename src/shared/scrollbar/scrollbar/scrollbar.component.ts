import {Component, AfterViewChecked, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import * as $ from 'jquery/dist/jquery.js';
import 'jquery-mousewheel/jquery.mousewheel.js';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js';

/**
 * document: http://manos.malihu.gr/jquery-custom-content-scroller/
 *           https://www.jianshu.com/p/550466260856
 */
@Component({
  selector: 'qk-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: [
    './scrollbar.component.scss'
  ]
})
export class ScrollbarComponent implements AfterViewChecked {
  @ViewChild('scrollbar') ele: ElementRef<any>;
  defaultconfig: any = {
    axis: 'y',
    theme: 'dark',
    advanced: {autoExpandHorizontalScroll: true},
    autoDraggerLength: true,
    scrollInertia: 100,
	keyboard:{ enable: true },
	autoHideScrollbar: true
  };
  @Input() config: any;
  @Output() init = new EventEmitter();
  id = 'scrollbar' + (new Date()).getTime() + (Math.random() * 666666 | 3332);

  ngAfterViewChecked() {
    if (!this.config) {
      this.config = {
        inited: false,
        options: {},
        qkScrollbar: null
      };
    }
    if (!this.config.inited && document.getElementById(this.id)) {
      this.config.inited = true;
      try {
        this.config.options = Object.assign(this.defaultconfig, this.config.options);
        if (this.config.qkScrollbar) {
          try {
            this.config.qkScrollbar.mCustomScrollbar('destroy');
          } catch (e) {
            console.warn('mCustomScrollbar destroy Error！', e);
          }
        }
        this.config.qkScrollbar = $(this.ele.nativeElement).mCustomScrollbar(this.config.options);
        this.init.emit(this.config.qkScrollbar);
      } catch (e) {
        console.warn('mCustomScrollbar Error！', e);
        this.config.inited = false;
      }
    }
  }

  constructor(private elementRef: ElementRef) {

  }
}
