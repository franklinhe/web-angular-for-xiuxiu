import { Component, ElementRef, ViewChild, Input, EventEmitter } from '@angular/core';
import * as G2 from '@antv/g2';

@Component({
  selector: 'qk-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent {
  @ViewChild('chart') chartEle: ElementRef<any>;
  chart: any = {};
  @Input('data')
  set data(value: any) {
    if (!value) return;
    // { item: '事例一', count: 40, percent: 0.4 }
    const data = [];
    value.forEach((v: any) => {
      data.unshift({
        type: v.name, value: parseFloat(v.value)
      });
    });
    this.chart.destroy && this.chart.destroy();
    const chart = new (G2 as any).Chart({
      container: this.chartEle.nativeElement,
      forceFit: true,
      padding: [45, 40, 50, 124],
      width: '90%',
      height: 100 + (value.length * 39)
    });
    this.chart = chart;
    chart.source(data, {
      value: {
        // max: 1300,
        // min: 0,
        nice: false,
        alias: ''
      }
    });
    chart.axis('type', {
      label: {
        textStyle: {
          fill: '#8d8d8d',
          fontSize: 12
        }
      },
      tickLine: {
        alignWithLabel: false,
        length: 0
      },
      line: {
        lineWidth: 0
      }
    });
    chart.axis('value', {
      label: null,
      title: null
    });
    chart.legend(false);
    chart.coord().transpose();
    chart.interval().position('type*value')
      .color('type', [
        '#face1d', '#37c461', '#2194ff',
        'rgb(178,200,187)', 'rgb(117,121,74)',
        'rgb(114,83,52)', 'rgb(69,137,148)',
        'rgb(182,194,154)', 'rgb(138,115,123)',
        'rgb(244,208,0)', 'rgb(229,131,18)'])
      .size(26)
      .opacity(1)
      .label('value', {
        textStyle: {
          fill: '#8d8d8d'
        },
        offset: 10
      });
    chart.render();
  }
}
