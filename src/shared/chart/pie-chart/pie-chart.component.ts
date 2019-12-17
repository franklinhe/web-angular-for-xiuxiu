import { Component, ViewChild, ElementRef, Input } from '@angular/core';
// import * as DataSet from '@antv/data-set';
import * as G2 from '@antv/g2';
// import * as g2plot from '@antv/g2plot';

@Component({
  selector: 'qk-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  @ViewChild('chart') chartEle: ElementRef<any>;
  chart: any = {};
  @Input('data')
  set data(value: any) {
    if (!value) return;
    // { item: '事例一', count: 40, percent: 0.4 }
    const data = [], total = value.reduce((a,b) => {
      if (a.value && b.value) {
        return parseFloat(a.value)+parseFloat(b.value);
      } else if (a.value) {
        return parseFloat(a.value)+b;
      } else {
        return a+parseFloat(b.value);
      }
    });
    value.forEach((v: any) => {
      data.push({
        item: v.name, count: parseFloat(v.value), percent: parseFloat(v.value)/total
      });
    });
    this.chart.destroy && this.chart.destroy();
    const chart = new (G2 as any).Chart({
      container: this.chartEle.nativeElement,
      forceFit: true,
      height: 300
    });
    this.chart = chart;
    chart.source(data, {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        }
      }
    });
    chart.coord('theta', {
      radius: 0.75
    });
    chart.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    chart.intervalStack()
      .position('percent')
      .color('item')
      .label('percent', {
        formatter: (val, item) => {
          return item.point.item + ': ' + val;
        }
      })
      .tooltip('item*percent', (item, percent) => {
        percent = (percent * 100).toFixed(2) + '%';
        return {
          name: item,
          value: percent
        };
      })
      .style({
        lineWidth: 1,
        stroke: '#fff'
      });
    chart.render();
  }
}
