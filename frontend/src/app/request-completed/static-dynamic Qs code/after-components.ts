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

//   constructor(private fb: FormBuilder,
//               private router: Router,
//               private route: ActivatedRoute,
//               private apiService: ApiService) {}
  
//   questions: any;
//   endOfRequired!: number;
//   endOfQuestions!: number;
//   showMessage: boolean=false;
//   submitMessage: boolean=false;

//   ////////////////////////////
//   myForm!: FormGroup;
//   showTextInput: boolean = false;
//   otherTxt: string="";   
//   //////////////

//   notOptionalSteps: number[]=[];
//   stepperDiv: number=1;
//   isNextButtonEnabled: boolean = false;
//   stepsChecked: number[]=[]
//   selectedYear!: number;
//   progressBarValue: number = 0;


//   ngOnInit() {

//     this.apiService.getQuestions().subscribe((data: any) => {
//       console.log('data: ', data.questions);

//       this.questions = data.questions;
//       console.log('questions: ', this.questions);

//       let lastRequiredQuestion = -1;
//       let lastQuestion = -1;
//       //Place all required questions first
//       this.questions.sort((Q1: any, Q2: any) => {
//         lastQuestion = Q2.order;
        
//         //Create array with not optional steps
//         if(Q1.required && !this.notOptionalSteps.includes(Q1.order)) {
//           this.notOptionalSteps.push(Q1.order);    
//         }

//         if (Q1.required && !Q2.required) {
//           lastRequiredQuestion = Q1.order;
//           // this.notOptionalSteps.push(Q1.order); 
//           return -1;
//         } else if (!Q1.required && Q2.required) {
//           return 1;
//         }
//         return 0;
//       });
//       this.endOfRequired = lastRequiredQuestion + 1;  //For the message div before the optional questions
//       // this.endOfQuestions = lastQuestion + 2;  //For the submit div (+2 because +1 of the message div)
//       this.endOfQuestions = lastQuestion + 1;
//       console.log('Updated notOptionalSteps:', this.notOptionalSteps);

//       console.log('Sorted questions: ', this.questions);
//       console.log('lastRequiredQuestion: ', lastRequiredQuestion, lastQuestion);


//       //Create the div data
//       // till here we have the sorted questions array with all the required questions Obj first and the optional after  
//       // we need to send to the html the descriptions and the options for each question
//       // depending the type of the question html will choose the corresponding component to display the data
//       // also if the question is required then we need to implement the logic for enabling the next button only when
//       // the user selects an option
//       // Also in case of other selected -> the textarea should appear ??????
      
//       // Also we need to adjust the form so that instead of step to have the question ID to usa it for the post request
//       // maybe before we have to split the questions to score and text questions
//       // in this case department will have a scoringQuestion of type {question: questionObjRef, score: number} similar for text
//       // in the backend we need to find the questionID of the department questionsArray using the questionObjRef
//       // and update the department's score for this question



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

//   addToNotOptionalSteps(order: number) {
//     if (!this.notOptionalSteps.includes(order) && order !== -1) {
//       this.notOptionalSteps.push(order);
//     }
//   }

// //---------------------------Dynamic questions--------------------------------//
//   goToNext(){
//     //goToPrevious also needs to be adjusted
//     console.log("bgNext stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)
    
//     if(this.stepperDiv===this.endOfRequired -1 && !this.showMessage){
//       this.showMessage=true;
//       this.updateProgressBarValue(true);
//     }
//     else if (this.stepperDiv===this.endOfQuestions-1 && !this.submitMessage){
//       this.submitMessage=true;
//       this.updateProgressBarValue(true);
//     }
//     else{        
//       this.showMessage=false;
//       this.stepperDiv+=1;
//       this.updateProgressBarValue(true);
//     }      

//     if (!this.stepsChecked.includes(this.stepperDiv) ){
//       this.isNextButtonEnabled = false;
//     }

//     console.log("endNext stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)
    
//   }

//   goToPrevious(){

//     console.log("bgPrevious stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)

//     if(this.stepperDiv === this.endOfQuestions-1 && this.submitMessage){
//       this.submitMessage=false;
//       this.updateProgressBarValue(false);
//     }
//     else if(this.stepperDiv === this.endOfRequired && !this.showMessage){
//       this.showMessage=true;
//       this.stepperDiv -=1
//       this.updateProgressBarValue(false);
//     }else if(this.stepperDiv === this.endOfRequired-1 && this.showMessage){
//       this.showMessage=false;
//       this.updateProgressBarValue(false);
//     }else{
//       this.stepperDiv -=1
//       this.updateProgressBarValue(false);
//       this.showMessage=false;
//       this.submitMessage=false;

//     }

//     if (this.stepsChecked.includes(this.stepperDiv) ){
//       this.isNextButtonEnabled = true;
//     }
//     console.log("endPrevious stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)
  

//   }

//   goToEnd(){
//     this.stepperDiv=this.endOfQuestions-1
//     this.submitMessage=true;
//     this.showMessage = false;
//     this.updateProgressBarValue(true);
//   }

  
//   updateProgressBarValue(increment: boolean = true) {
//     console.log("length: ", this.questions.length)
//     const stepsCount = this.questions.length + 1 ;
//     console.log("stepsCount: ", stepsCount)
//     const step  = 100/stepsCount
//     console.log("step, increment: ", step, increment)
//     if (increment) {
      
//       this.progressBarValue += step; 
//       if(this.stepperDiv === this.endOfQuestions-1 && this.submitMessage){
//       this.progressBarValue = 100;
//       } 
//     }
//     else { 
//       this.progressBarValue -= step;
//       if(this.stepperDiv === 1){
//         this.progressBarValue = 0;
//       } 
//     }
//   }


// //----------------------------------------------------------------//

  
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
    
//     //passing also requestID
//     // this.router.navigate(['/formDone'], { queryParams: { average: average, requestID: this.requestID }});
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
