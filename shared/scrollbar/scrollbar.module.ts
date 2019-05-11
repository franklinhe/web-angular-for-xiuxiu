import {NgModule} from "@angular/core";
import { ScrollbarComponent } from './scrollbar/scrollbar.component';

@NgModule({
  declarations: [
    ScrollbarComponent
  ],
  exports: [
    ScrollbarComponent
  ]
})
export class ScrollbarModule {}
