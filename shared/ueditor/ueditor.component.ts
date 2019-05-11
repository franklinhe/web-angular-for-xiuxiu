import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UEditorComponent } from 'ngx-ueditor';

@Component({
  selector: 'qk-ueditor',
  templateUrl: './ueditor.component.html',
  styleUrls: ['./ueditor.component.scss']
})
export class UeditorComponent implements OnInit {
  @Input() config: any = {};
  @ViewChild('full') full: UEditorComponent;
  constructor() { }

  ngOnInit() {
    // this.full.Instance.getAllHtml();
    this.full['onChange'] = () => {};
    // this.config.full = this.full;
  }

  _ready(e: any) {
    if (this.config.value) {
      this.full.Instance.setContent(this.config.value);
    } else {
      this.config.value = this.full['value'];
    }        
    this.config.full = this.full;
  }
  _destroy() {}
  _change(e: any) {}
}
