// import { Component, ElementRef, ViewChild,AfterViewInit, OnInit} from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { MatRadioChange } from '@angular/material/radio';
// import { ActivatedRoute, Route, Router } from '@angular/router';
// import * as moment from 'moment';
// import { Moment } from 'moment'; 
// import { MatDatepicker } from '@angular/material/datepicker';
// import { ApiService } from '../services/api.service';
// import { Score } from '../models/scoreQuestion.model';
// import { Text } from '../models/textQuestion.model';


// @Component({
//   selector: 'app-request-completed',
//   templateUrl: './request-completed.component.html',
//   styleUrls: ['./request-completed.component.css'],

// })


// export class RequestCompletedComponent implements  OnInit{
//   durationValue: number = 2000;
//   // apiService: any;

//   constructor(private fb: FormBuilder,
//               private router: Router,
//               private route: ActivatedRoute,
//               private apiService: ApiService) {}
  
//   questions: any;
  
//   myForm!: FormGroup;
//   showTextInput: boolean = false;
//   otherTxt: string="";   

//   stepperDiv: number=1;
//   isNextButtonEnabled: boolean = false;
//   notOptionalSteps: number[] = [1, 2, 3, 4]
//   scoreOptions: number[] = [1, 2, 3, 4, 5]
//   radioOptions: string[] = ['Διαδίκτυο', 'Γνωστός', 'Άλλο']
//   educationOptions: string[] = ['Φοιτητής', 'Υπάλληλος', 'Άνεργος']
//   stepsChecked: number[]=[]
//   selectedYear!: number;
//   progressBarValue: number = 0;

//   ngOnInit() {

//     this.apiService.getQuestions().subscribe((data: any) => {
//       console.log('data: ', data.questions);

//       this.questions = data.questions;
//       console.log('questions: ', this.questions);

//       for(let question of this.questions){
        
//       }

//     });

//     this.myForm = this.fb.group({
//       step1:'',
//       step2:'',
//       step3:'',
//       step4:'',
//       step6:'',
//       step7:'',
//       step8:'',
//       otherTxt:''
//       })
//       //api to get the questions description
      
//   }

//   goToNext(){

//     if(this.stepperDiv<9){
//       this.stepperDiv+=1;
//       this.updateProgressBarValue(true);
//     }


//     if (!this.stepsChecked.includes(this.stepperDiv) ){
//       this.isNextButtonEnabled = false;
//     }
    
    
//   }
//   goToPrevious(){
//     if(this.stepperDiv>1){
//       this.stepperDiv-=1;
//       this.updateProgressBarValue(false)
//     }
    
//       if (this.stepsChecked.includes(this.stepperDiv) ){
//         this.isNextButtonEnabled = true;
//       }
//   }

//   goToEnd(){
//     this.stepperDiv=9
//     this.updateProgressBarValue(true);
//   }

//   updateProgressBarValue(increment: boolean = true) {
//     if (increment) {
      
//       this.progressBarValue += 12.5; 
//       if(this.stepperDiv === 9){
//       this.progressBarValue = 100;
//       } 
//     }
//     else { 
//       this.progressBarValue -= 12.5;
//       if(this.stepperDiv === 1){
//         this.progressBarValue = 0;
//       } 
//     }
//   }

//   enableNextButton(optionSelected: any){
    
//     if (!this.stepsChecked.includes(this.stepperDiv) && this.notOptionalSteps.includes(this.stepperDiv)){
//       this.stepsChecked.push(this.stepperDiv)
//     }
    
//     if(this.stepperDiv<5 || this.stepsChecked.includes(this.stepperDiv))
//     this.isNextButtonEnabled = true;

//     if (this.stepperDiv === 4 && optionSelected === 'Άλλο') {
//       this.showTextInput = true;
//     } else {
//       this.showTextInput = false;
//       this.otherTxt = "";
//     }

//   }  

//   notOptional(){
//     return this.notOptionalSteps.includes(this.stepperDiv);
//   }

//   getValues(){
//     // const scoresAnswers: { question: string; score: number; }[] = [];
//     // const textsAnswers: { question: string; answer: string; }[] = [];
//     const scoresAnswers: Score[] = [];
//     const textsAnswers: Text[] = [];
//     let scoreCount: number = 1
//     let textCount: number = 1

//     // step4 = given value when other is selected
//     if (this.myForm.get('step4')?.value === 'Άλλο') {
//       this.myForm.get('step4')?.setValue(this.myForm.get('otherTxt')?.value);
//     }   

//     //preparing postData
//     Object.keys(this.myForm.controls).forEach(controlName => {
//       if (controlName === 'otherTxt') {
//         return;
//       }
//       const control = this.myForm.get(controlName);

//       if (control) {
//         const value = control.value;

//         if (typeof value === 'number' && !isNaN(value)) {
//           let responsePair = {"question":"ερώτηση "+scoreCount , "score":value}
//           scoresAnswers.push(responsePair);
//           scoreCount++

//         } else if (typeof value === 'string') {
//           let responsePair = {"question":"ερώτηση "+textCount , "answer":value}
//           textsAnswers.push(responsePair);
//           textCount++
//         }
//       }
//     });
    
//     console.log("Scores: ", scoresAnswers);
//     console.log("Text Values: ", textsAnswers);
    
//     console.log("value: ", this.myForm.value)
//     console.log({"ερώτηση 1": this.myForm.value.step1,"ερώτηση 2": this.myForm.value.step2})
    
//     const average = this.getAverage()
//     console.log("Average value: ", average);

//     //call post function to save data
//     this.apiService.aPostMethod(scoresAnswers, textsAnswers)
//     // this.apiService.aPostMethod(scoresAnswers)

//     // this.router.navigate(['formDone'], { relativeTo: this.route });
//     this.router.navigate(['/formDone'],{queryParams:{average:average}});
//   }

//   getAverage(){
//     const step1Value = parseFloat(this.myForm.get('step1')?.value);
//     const step2Value = parseFloat(this.myForm.get('step2')?.value);
//     const step3Value = parseFloat(this.myForm.get('step3')?.value);

//     return (step1Value + step2Value + step3Value) / 3;
//   }

//   chosenYearHandler(normalizedYear: Moment) {
  
//     // const dp: MatDatepicker<any> = {} as MatDatepicker<any>; 
//     const selectedYear = normalizedYear.year();
//     const selectedYearStr = selectedYear.toString();
  
//     this.myForm.get('step7')?.setValue(selectedYearStr);
//     this.selectedYear = selectedYear;
//     // dp.close();   
    
//   }
  
// }
