import { Component, Input, OnChanges } from '@angular/core';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  view: [number, number] = [600, 400];
  @Input() colorScheme!: Color ;
  @Input() results!: any[];
  showLegend: boolean = true;
  showLabels = true;
  // doughnut = true;
  legendTitle: string="  ";  
}
