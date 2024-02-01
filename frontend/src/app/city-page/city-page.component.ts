import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { City } from '../models/city.model';
import { Department } from '../models/department.model';
import { Router } from '@angular/router';

import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-city-page',
  templateUrl: './city-page.component.html',
  styleUrls: ['./city-page.component.css']
})
export class CityPageComponent implements OnInit {  

  constructor(private apiService: ApiService, private router: Router) {}

  //City data
  city!: City;
  cityName!: string;
  cityScore!: number;
  evaluationsCount!: number;
  departmentScores: { department: string, score: number }[] = [];

  //-----------Charts----------------
  highestScoreIndex: number = -1;
  lowestScoreIndex: number = -1;
  
  // Colors
  //domain should be the length of the number of departments
  scoresColorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#87CEFA', '#87CEFA', '#87CEFA', '#87CEFA', '#87CEFA', '#87CEFA'] 
  };

  demographicsColorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4C4C9D', '#C0B9DD', '#FA8072', '#5E7CE2','#A5E6BA', '#92B4F4'] 
  };

  // Data 
  public departmentsData: { name: string, value: number }[] = [];
  public genderData: { name: string, value: number }[] = [];
  public ageGroupData: { name: string, value: number }[] = [];
  public educationLevelData: { name: string, value: number }[] = [];
  public contactData: { name: string, value: number }[] = [];

  ngOnInit(): void {
    this.getCityPageData()
    
  }

  getCityPageData(): void {
    this.apiService.getCityData().subscribe((data) => {
      this.city = data.city;
      this.cityName = this.city.name;
      this.evaluationsCount = this.city.evaluationsCount;
      this.cityScore = this.city.cityScore;
      this.cityScore = parseFloat(this.cityScore.toFixed(1));        

      this.departmentScores = this.city.departments.map((department: Department) => ({
        department: department.name,
        score: parseFloat(department.totalDepartmentScore.toFixed(1))
      }));

      this.createCharts(this.departmentScores,this.city.demographics)

      
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }

  createCharts(departmentScores: {department: string;score: number;}[], demographics: any): void {
    this.departmentsData = departmentScores.map(data => ({
      name: data.department,
      value: data.score
    }));

    this.highestScoreIndex = departmentScores.reduce((maxIndex, currentScore, currentIndex, arr) =>
      currentScore.score > arr[maxIndex].score ? currentIndex : maxIndex, 0);
    this.lowestScoreIndex = departmentScores.reduce((minIndex, currentScore, currentIndex, arr) =>
      currentScore.score < arr[minIndex].score ? currentIndex : minIndex, 0);

    this.scoresColorScheme.domain[this.highestScoreIndex] ='#008000'
    this.scoresColorScheme.domain[this.lowestScoreIndex] ='#FF0000'
      
    console.log("high-low: ", this.highestScoreIndex, this.lowestScoreIndex);

    // Demographics
    //Assign demographics data
    this.genderData = this.getChartData(demographics.gender);
    this.ageGroupData = this.getChartData(demographics.ageGroup);
    this.educationLevelData = this.getChartData(demographics.educationLevel);
    this.contactData = this.getChartData(demographics.contact);
  }


  //getting label and data values from Object
  private getChartData(demographics: any): { name: string, value: number }[] {
    return Object.entries(demographics).map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0     }));
  }

}
