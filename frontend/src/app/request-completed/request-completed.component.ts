import { Component, ElementRef, ViewChild,AfterViewInit, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Route, Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment'; 
import { MatDatepicker } from '@angular/material/datepicker';
import { ApiService } from '../services/api.service';
import { Score } from '../models/scoreQuestion.model';
import { Text } from '../models/textQuestion.model';

@Component({
  selector: 'app-request-completed',
  templateUrl: './request-completed.component.html',
  styleUrls: ['./request-completed.component.css'],

})

export class RequestCompletedComponent implements  OnInit{
  durationValue: number = 2000;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService) {}
  
  questions: any;
  questionsIDs: string[] = [];
  endOfRequired!: number;
  endOfQuestions!: number;
  showMessage: boolean=false;
  submitMessage: boolean=false;

  ////////// To be changed for Dynamic Qs //////////
  showTextInput: boolean = false;
  otherTxt: string="";   
  //////////////////////////////////////////////////
  requestID!: string;
  evaluationID!: string;
  myForm!: FormGroup;
  requiredSteps: number[]=[];
  stepperDiv: number=1;
  isNextButtonEnabled: boolean = false;
  stepsChecked: number[]=[]
  selectedYear!: number;
  progressBarValue: number = 0;


  ngOnInit() {
    this.requestID = this.route.snapshot.params['requestID'];
    this.route.queryParams.subscribe(params => {
      this.evaluationID = params['evaluationID'];
    });
    console.log("reqDone - requestID: ", this.requestID)
    console.log("reqDone - evaluationID: ", this.evaluationID)

    this.myForm = this.fb.group({
      step1:'',
      step2:'',
      step3:'',
      step4:'',
      step5:'',
      step6:'',
      step7:'',
      otherTxt:''
      })

    this.apiService.getQuestions().subscribe((data: any) => {
      this.questions = data.questions;
      console.log('after api questions: ', this.questions);

      let lastRequiredQuestion = -1;
      let lastQuestion = -1;
      const qOrder = []
      

      //Place all required questions first
      this.questions.sort((Q1: any, Q2: any) => {
        lastQuestion = Q2.order;
        console.log("questions: " , this.questions)
        // console.log('Q1, Q2: ', Q1, Q2);
        console.log("Q1.order, Q2.order: ", Q1.order, Q2.order)

        //Create array with not optional steps
        if(Q1.required && !this.requiredSteps.includes(Q1.order)) {
          this.requiredSteps.push(Q1.order);    
          console.log("inside store optional Q1.order: ", Q1.order)
        }

        if(Q2.required && !this.requiredSteps.includes(Q2.order)) {
          this.requiredSteps.push(Q2.order);    
          console.log("inside store optional Q2.order: ", Q2.order)
        }

        if (Q1.required && !Q2.required) {          
          lastRequiredQuestion = Q1.order;
          return -1;

        } else if (!Q1.required && Q2.required) {
          lastRequiredQuestion = Q2.order;
          return 1;
        }
        
        return 0;
        
      });

      //Sort questions IDs
      for (const question of this.questions) {
        this.questionsIDs.push(question._id);

        //Creating 
      }


      this.endOfRequired = lastRequiredQuestion + 1;  //For the message div before the optional questions
      // this.endOfQuestions = lastQuestion + 2;  //For the submit div (+2 because +1 of the message div)
      this.endOfQuestions = lastQuestion + 1;

      console.log('Updated requiredSteps:', this.requiredSteps);
      console.log('Sorted questions: ', this.questions);
      console.log('questionsIDs: ', this.questionsIDs);
      console.log('lastRequiredQuestion: ', lastRequiredQuestion, lastQuestion);
      console.log('endOfRequired, endOfQuestions: ', this.endOfRequired, this.endOfQuestions);


      //Create the div data
      // till here we have the sorted questions array with all the required questions Obj first and the optional after  
      // we need to send to the html the descriptions and the options for each question
      // depending the type of the question html will choose the corresponding component to display the data
      // also if the question is required then we need to implement the logic for enabling the next button only when
      // the user selects an option
      // Also in case of other selected -> the textarea should appear ??????
      
      // Also we need to adjust the form so that instead of step to have the question ID to usa it for the post request
      // maybe before we have to split the questions to score and text questions
      // in this case department will have a scoringQuestion of type {question: questionObjRef, score: number} similar for text
      // in the backend we need to find the questionID of the department questionsArray using the questionObjRef
      // and update the department's score for this question


    });
      
      
  }

  // addToNotOptionalSteps(order: number) {
  //   if (!this.requiredSteps.includes(order) && order !== -1) {
  //     this.requiredSteps.push(order);
  //   }
  // }

//---------------------------Dynamic questions--------------------------------//
  goToNext(){  

    console.log("Entering Next stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)    
    if(this.stepperDiv===this.endOfRequired -1 && !this.showMessage){
      this.showMessage=true;
      this.updateProgressBarValue(true);
    }
    else if (this.stepperDiv===this.endOfQuestions-1 && !this.submitMessage){
      this.submitMessage=true;
      this.updateProgressBarValue(true);
    }
    else{        
      this.showMessage=false;
      this.stepperDiv+=1;
      this.updateProgressBarValue(true);
    }      

    if (!this.stepsChecked.includes(this.stepperDiv) ){
      this.isNextButtonEnabled = false;
    }
   console.log("Exiting Next stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)
    
  }

  goToPrevious(){

    console.log("Entering Previous stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)

    if(this.stepperDiv === this.endOfQuestions-1 && this.submitMessage){
      this.submitMessage=false;
      this.updateProgressBarValue(false);
    }
    else if(this.stepperDiv === this.endOfRequired && !this.showMessage){
      this.showMessage=true;
      this.stepperDiv -=1
      this.updateProgressBarValue(false);
    }else if(this.stepperDiv === this.endOfRequired-1 && this.showMessage){
      this.showMessage=false;
      this.updateProgressBarValue(false);
    }else{
      this.stepperDiv -=1
      this.updateProgressBarValue(false);
      this.showMessage=false;
      this.submitMessage=false;

    }

    if (this.stepsChecked.includes(this.stepperDiv) ){
      this.isNextButtonEnabled = true;
    }
    console.log("Exiting Previous stepperDiv, showMessage, submitMessage: ", this.stepperDiv, this.showMessage, this.submitMessage)
  

  }

  goToEnd(){
    this.stepperDiv=this.endOfQuestions-1
    this.submitMessage=true;
    this.showMessage = false;
    this.updateProgressBarValue(true);
  }

  
  updateProgressBarValue(increment: boolean = true) {
    //console.log("length: ", this.questions.length)
    const stepsCount = this.questions.length + 1 ;
    //console.log("stepsCount: ", stepsCount)
    const step  = 100/stepsCount
    //console.log("step, increment: ", step, increment)
    if (increment) {
      
      this.progressBarValue += step; 
      if(this.stepperDiv === this.endOfQuestions-1 && this.submitMessage){
      this.progressBarValue = 100;
      } 
    }
    else { 
      this.progressBarValue -= step;
      if(this.stepperDiv === 1){
        this.progressBarValue = 0;
      } 
    }
  }
//----------------------------------------------------------------//

  
  enableNextButton(optionSelected: any){

    //set Form values (when reaching the message for optional needs to -1)    
    const currentStepControlName = `step${this.stepperDiv}`;
    this.myForm.get(currentStepControlName)?.setValue(optionSelected);
    // console.log("optionSelected: ", optionSelected)
    console.log("currentStep: ", currentStepControlName)
    // console.log("myForm: ", this.myForm.value)

    //if this.stepperDiv is required and is the first time we reach it then add it to the stepsChecked array
    if (!this.stepsChecked.includes(this.stepperDiv) && this.requiredSteps.includes(this.stepperDiv)){
      this.stepsChecked.push(this.stepperDiv)
    }
    
    //if we are before the text going to the optional questions and stepperDiv is required add it to the stepsChecked array
    if(this.stepperDiv<this.endOfRequired || this.stepsChecked.includes(this.stepperDiv))
    this.isNextButtonEnabled = true;

    if (this.stepperDiv === 4 && optionSelected === 'Άλλο') {
      this.showTextInput = true;
    } else {
      this.showTextInput = false;
      this.otherTxt = "";
    }

  }  

  notOptional(){
    return this.requiredSteps.includes(this.stepperDiv);
  }

  chosenYearHandler(selectedYear: any) {
  
    const selectedYearStr = selectedYear.toString();
    const currentStepControlName = `step${this.stepperDiv}`;
      
    this.myForm.get(currentStepControlName)?.setValue(selectedYearStr);
    //console.log("selectedYear: ", selectedYear)
    console.log("currentStep: ", currentStepControlName)
    //console.log("myForm: ", this.myForm.value)

  }

  submitForm(){
    // --------------Dynamic Questions-----------------//
    const scoresAnswers: Score[] = [];
    const textsAnswers: Text[] = [];

    for (const questionID of this.questionsIDs) {
      const questionObject = this.questions.find((q: any) => q._id === questionID);

      if (questionObject) {
        const controlName = `step${questionObject.order}`;
        const control = this.myForm.get(controlName);

        if (control) {
          const value = control.value;

          if (questionObject.type === 'scoring' && typeof value === 'number' && !isNaN(value)) {
            const scoreAnswer = { question: questionObject, score: value };
            scoresAnswers.push(scoreAnswer);
          } else if (questionObject.type === 'text' && typeof value === 'string') {
            const textAnswer = { question: questionObject, answer: value };
            textsAnswers.push(textAnswer);
          }
        }
      }
    }
    console.log('requestID: ', this.requestID);
    console.log('Scores: ', scoresAnswers);
    console.log('Text Values: ', textsAnswers);

    //also requestID and evalID
    console.log("value: ", this.myForm.value)   

    //call post function to save data
    this.apiService.saveEvaluationData(this.requestID,this.evaluationID,scoresAnswers, textsAnswers)

    // this.evaluationID='csdiug2809'
    this.router.navigate([`${this.requestID}/formDone`], {queryParams: {evaluationID: this.evaluationID}});

    //------------------------------------------------//      

  }



}
