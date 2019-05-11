import { Component, AfterViewChecked, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
  defaultOptions: any = {
    axis: 'y',
    theme: 'minimal-dark',
    advanced: { autoExpandHorizontalScroll: true },
    autoDraggerLength: true,
    scrollInertia: 100
  };
  @Input() options: any;
  @Output() init = new EventEmitter();
  qkScrollbar: any;

  ngAfterViewChecked() {
    if (!this.qkScrollbar && this.ele && this.ele.nativeElement) {
      this.options = Object.assign(this.defaultOptions, this.options);
      this.qkScrollbar = $(this.ele.nativeElement).mCustomScrollbar(this.options);
      this.init.emit(this.qkScrollbar);
    }
  }
}
