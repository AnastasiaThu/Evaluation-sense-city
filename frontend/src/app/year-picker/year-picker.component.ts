import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.css']
})
export class YearPickerComponent {
  // @Output() yearSelected = new EventEmitter<Moment>();
  @Output() yearSelected = new EventEmitter<number>();  //DQ
  date = new FormControl();
  selectedYear!: number;

  @ViewChild('yearInput') yearInput!: ElementRef<HTMLInputElement>;

  chosenYearHandler(normalizedYear: Moment) {
    const selectedYear = normalizedYear.year();
    this.date.setValue(moment({ year: selectedYear, month: 0, day: 1 }));
    this.selectedYear = selectedYear;

    // Set the value of the custom input element
    if (this.yearInput) {
      this.yearInput.nativeElement.value = this.selectedYear !== undefined ? this.selectedYear.toString() : '';
    }

    // this.yearSelected.emit(normalizedYear);
    this.yearSelected.emit(selectedYear); //DQ
  }

  dateFilter = (d: Moment | null): boolean => {
    const currentYear = moment().year();
    const year = d ? d.year() : 0;
    return year < currentYear - 10;
  }
}


