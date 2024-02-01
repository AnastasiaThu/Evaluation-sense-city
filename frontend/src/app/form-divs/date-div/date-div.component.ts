import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-div',
  templateUrl: './date-div.component.html',
  styleUrls: ['./date-div.component.css']
})
export class DateDivComponent {
  @Input() question: string = '';
  @Input() order: number = 1;

  //DQ
  @Output() yearSelected = new EventEmitter<number>();

  chosenYearHandler(year: number) {
    console.log("year: ", year, typeof(year));
    this.yearSelected.emit(year);
  }
}
