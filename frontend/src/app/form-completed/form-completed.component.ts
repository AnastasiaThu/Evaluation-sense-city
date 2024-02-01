import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-completed',
  templateUrl: './form-completed.component.html',
  styleUrls: ['./form-completed.component.css']
})
export class FormCompletedComponent implements OnInit {
  averageValue: number = 0;
  requestID: string = '';
  evaluationID: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() { 
    
    this.requestID = this.route.snapshot.params['requestID'] || '';
    this.route.queryParams.subscribe(params => {

      // const rawAverage = params['average'] || 0;     // display of averageValue not needed
      // this.averageValue = parseFloat(parseFloat(rawAverage).toFixed(1));   
      this.evaluationID = params['evaluationID'] || '';

      console.log("evaluationID:", this.evaluationID)
      console.log("requestID: ", this.requestID);
    });
  }
}
