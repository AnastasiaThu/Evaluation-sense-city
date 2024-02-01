import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-text-div',
  templateUrl: './text-div.component.html',
  styleUrls: ['./text-div.component.css']
})
export class TextDivComponent {
  @Input() question: string = '';
  @Input() options: string[] = [];
  @Input() order: number = 1;
  @Output() nextButtonEnabled = new EventEmitter<boolean>();

  enableNextButton(option: any) {
    //DQ
    console.log(option);
    this.nextButtonEnabled.emit(option);
  }

}
