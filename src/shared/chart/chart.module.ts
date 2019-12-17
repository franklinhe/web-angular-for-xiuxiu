import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';

@NgModule({
  declarations: [PieChartComponent, ColumnChartComponent],
  exports: [PieChartComponent, ColumnChartComponent],
  imports: [
    CommonModule
  ]
})
export class ChartModule { }
