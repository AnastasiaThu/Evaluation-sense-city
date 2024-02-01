// import { Component, Input, Output, EventEmitter } from '@angular/core';

// @Component({
//   selector: 'app-score-div',
//   templateUrl: './score-div.component.html',
//   styleUrls: ['./score-div.component.css']
// })
// export class ScoreDivComponent {
//   @Input() question: string = '';
//   @Input() scoreOptions: number[] = [];
//   @Input() order: number = 1;
//   @Output() nextButtonEnabled = new EventEmitter<boolean>();

//   enableNextButton(option: any) {
//     this.nextButtonEnabled.emit(true);
//   }
// }


import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-score-div',
  templateUrl: './score-div.component.html',
  styleUrls: ['./score-div.component.css']
})
export class ScoreDivComponent {
  @Input() question: string = '';
  @Input() scoreOptions: number[] = [];
  @Input() order: number = 1;
  // @Output() nextButtonEnabled = new EventEmitter<boolean>();
  @Output() nextButtonEnabled = new EventEmitter<any>();

  // DQ passing the score to the parent component
  // @Output() scoreSelected = new EventEmitter<number>(); 
  selectedScore!: number;
  // -----------------//

  enableNextButton(option: any) {
    // DQ
    console.log(option);
    this.nextButtonEnabled.emit(option);
    this.selectedScore = option;

    // this.nextButtonEnabled.emit(true);
    // this.scoreSelected.emit(this.selectedScore);
  }
}