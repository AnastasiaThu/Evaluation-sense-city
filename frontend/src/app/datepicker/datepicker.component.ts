import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  @Input() max: any;
  today = new Date();
  startDate: Date | null = null;
  endDate: Date | null = null;

  @Output() dateRangeSelected = new EventEmitter<{ startDate: Date | null, endDate: Date | null }>();
  
  private emitDateRange(): void {
    this.dateRangeSelected.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  constructor(private snackBar: MatSnackBar) {
    this.today.setDate(this.today.getDate());
  } 

  updateStartDate(event: MatDatepickerInputEvent<Moment>): void {
    this.startDate = event.value?.toDate() || null;
    console.log("this.startDate: ", this.startDate)
    this.emitDateRange();
  }

  updateEndDate(event: MatDatepickerInputEvent<Moment>): void {
    this.endDate = event.value?.toDate() || null;
    this.emitDateRange();

    console.log("this.endDate: ", this.endDate) 

    if (this.startDate && this.endDate && this.endDate < this.startDate) {
      console.log("if")
      this.snackBar.open('Παρακαλώ επιλέξτε έγκυρες ημερομηνίες', 'OK', {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "center"
      });

      // Reset the end date to prevent an invalid selection
      this.endDate = null;
      this.emitDateRange();
    }
  }
  

}


// import { Component, Input } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { Moment } from 'moment';
// import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
// import * as moment from 'moment';

// import { MatSnackBar } from '@angular/material/snack-bar';


// @Component({
//   selector: 'app-datepicker',
//   templateUrl: './datepicker.component.html',
//   styleUrls: ['./datepicker.component.css']
// })
// export class DatepickerComponent {
//   @Input() max: any;
//   today = new Date();
//   startDate: Date | null = null;
//   endDate: Date | null = null;

//   constructor(private snackBar: MatSnackBar) {
//     this.today.setDate(this.today.getDate());
//   }

//   updateStartDate(event: MatDatepickerInputEvent<Moment>): void {
//     this.startDate = event.value?.toDate() || null;
//   }

//   updateEndDate(event: MatDatepickerInputEvent<Moment>): void {
//     const selectedEndDate = event.value?.toDate() || null;

//     if (this.startDate && selectedEndDate && selectedEndDate < this.startDate) {
//       this.snackBar.open('End date cannot be earlier than the start date', 'OK', {
//         duration: 3000,
//         verticalPosition: "top",
//         horizontalPosition: "center"
//       });

//       // Reset the end date to prevent an invalid selection
//       this.endDate = null;
//     } else {
//       // Update the end date if the selection is valid
//       this.endDate = selectedEndDate;
//     }
//   }
// }