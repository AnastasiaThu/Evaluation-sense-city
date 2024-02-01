import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Department } from '../models/department.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { trigger, state, style, transition, animate } from '@angular/animations';


// import { MatCarouselModule } from '@ngmodule/material-carousel';


@Component({
  selector: 'app-department-page',
  templateUrl: './department-page.component.html',
  styleUrls: ['./department-page.component.css'],
  animations:  [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      transition('void <=> *', [
        animate('300ms ease-in-out', style({
          transform: 'translateX(0)',
          opacity: 1
        }))
      ])
    ])
  ]
})

export class DepartmentPageComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute, 
    private apiService: ApiService,) {}

  //carousel
  items = [{ title: 'Slide 1' }, { title: 'Slide 2' }, { title: 'Slide 3' }];
  chart: number=1;

  // Department data
  department!: Department;
  cityName!: string;
  departmentName!: string;  
  evaluationsCount!: number;
  totalDepartmentScore!: number;
  averageScores: { question: string, score: number }[] = [];

  // Date range 
  startDate: Date | null = null;
  endDate: Date | null = null;

  //-----------Charts----------------
  highestScoreIndex: number = -1;
  lowestScoreIndex: number = -1;

  // Colors
  //domain should be the length of the number of departments
  scoresColorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#585CCE', '#585CCE', '#585CCE', '#585CCE', '#585CCE', '#585CCE'] // All blue by default
  };

  demographicsColorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4C4C9D', '#C0B9DD', '#FA8072', '#5E7CE2','#A5E6BA', '#92B4F4'] 
  };
  //"#90EE90"

  // Data 
  public scoreData: { name: string, value: number }[] = [];
  public genderData: { name: string, value: number }[] = [];
  public ageGroupData: { name: string, value: number }[] = [];
  public educationLevelData: { name: string, value: number }[] = [];
  public contactData: { name: string, value: number }[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.departmentName = params.get('name') || '';
      this.cityName = params.get('city') || '';
      console.log("ngOninit - dep name: ", this.departmentName);

      this.getDepartmentPageData(this.cityName, this.departmentName)

    });

    this.autoTransitionToNextChart();
  }


  getDepartmentPageData(cityName: string, departmentName: string): void {
    // Get department from the DB based on this.cityName and this.departmentName
    this.apiService.getDepartmentByName(cityName, departmentName).subscribe(data => {
      this.department = data;
      console.log('inside FUNC 1: Department Data:', this.department);
      this.evaluationsCount = this.department.evaluationsCount;
      this.totalDepartmentScore = this.department.totalDepartmentScore;
      this.totalDepartmentScore = parseFloat(this.totalDepartmentScore.toFixed(1));        

    //Average Scores 
    this.averageScores = this.department.averageScores.map((score: any) => ({
      question: score.question,
      score: parseFloat(score.score.toFixed(1))
    }));
    console.log("sending to createCharts: ", this.averageScores, this.department.demographics)
    this.createCharts(this.averageScores,  this.department.demographics)
    
    });
  }

  createCharts(averageScores: {question:string, score:number}[], demographics: any): void {
    console.log("inside FUNC 2: averageScores: ", averageScores)
    //----------Charts Data----------------
    this.scoreData = averageScores.map((data) => ({
      name: data.question,
      value: data.score
    }));

    console.log("scoreData: ", this.scoreData)

    this.highestScoreIndex = averageScores.reduce((maxIndex, currentScore, currentIndex, arr) =>
      currentScore.score > arr[maxIndex].score ? currentIndex : maxIndex, 0);
    this.lowestScoreIndex = averageScores.reduce((minIndex, currentScore, currentIndex, arr) =>
      currentScore.score < arr[minIndex].score ? currentIndex : minIndex, 0);

    this.scoresColorScheme.domain[this.highestScoreIndex] ='#008000'
    //red codes: DE0A26, F01E2C, F94449, FF483F, FF2C2C
    this.scoresColorScheme.domain[this.lowestScoreIndex] ='#DE0A26'

    console.log("high-low: ", this.highestScoreIndex, this.lowestScoreIndex);
    // Demographics
    //Assign demographics data
    this.genderData = this.getChartData(demographics.gender);
    this.ageGroupData = this.getChartData(demographics.ageGroup);
    this.educationLevelData = this.getChartData(demographics.educationLevel);
    this.contactData = this.getChartData(demographics.contact);
    console.log("genderData: ", this.genderData)
    console.log("ageGroupData: ", this.ageGroupData)  
    console.log("educationLevelData: ", this.educationLevelData)
    console.log("contactData: ", this.contactData)

  }


  //getting label and data values from Object
  private getChartData(demographics: any): { name: string, value: number }[] {
    return Object.entries(demographics).map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0  
    }));
  }  

  //Enable search button
  onDateRangeSelected(event: { startDate: Date | null, endDate: Date | null }): void {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
  }

  checkDatesValidity(): boolean {
    return !!this.startDate && !!this.endDate && this.startDate < this.endDate;
  }

  filterData(): void {
    if (this.checkDatesValidity()) {
      // Make a GET request to the backend with the startDate and endDate
      const startDate = this.startDate ? this.startDate.toLocaleDateString('en-CA') : null;
      const endDate = this.endDate ? this.endDate.toLocaleDateString('en-CA') : null;
      // console.log("frontend - department.ts:")
      // console.log("before foramt: ", this.startDate, this.endDate)
      console.log("formated dates: ", startDate, endDate)
      // console.log("types: ", typeof(this.startDate), typeof(this.endDate))

      this.apiService.datesFilter(this.cityName, this.departmentName, startDate, endDate)
         .subscribe(data => {
          const filteredData = data.filteredData;
          this.totalDepartmentScore = filteredData.totalDepartmentScore;
          this.totalDepartmentScore = parseFloat(this.totalDepartmentScore.toFixed(1));
          this.evaluationsCount = filteredData.evaluationsCount;
          
          console.log("filteredData: ", data.filteredData)

          this.averageScores = filteredData.averageScores.map((score: any) => ({
            question: score.question,
            score: parseFloat(score.score.toFixed(1))
          }));
         console.log("sending to createCharts: ", this.averageScores, filteredData.demographics)
          this.createCharts(this.averageScores, filteredData.demographics)        
      })    

    } else {
      console.log('Invalid date range');
    }
  }

  reset(): void {
    if (this.cityName && this.departmentName) {
      this.getDepartmentPageData(this.cityName, this.departmentName);
      this.scoresColorScheme.domain = ['#585CCE', '#585CCE', '#585CCE', '#585CCE', '#585CCE', '#585CCE'];
    }
  }

  goToNext(){
    if(this.chart===4){
      this.chart=1;
    }
    else{
      this.chart+=1;
    }    
  }

  goToPrevious(){
    if(this.chart===1){
      this.chart=4;
    }
    else{
      this.chart-=1;
    }
  }

  // Function to transition to the next chart after 3 seconds
  autoTransitionToNextChart() {
    setInterval(() => {
      this.chart = this.chart < 4 ? this.chart + 1 : 1;
    }, 5000);
  }


}