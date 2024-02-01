import { Component, Input } from '@angular/core';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  view: [number, number] = [600, 400];
  @Input() colorScheme!: Color ;
  @Input() results!: any[];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = true;
  legendTitle: string="  ";
}
