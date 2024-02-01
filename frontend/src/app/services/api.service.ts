import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Score } from '../models/scoreQuestion.model';
import { Text } from '../models/textQuestion.model';
import { Department } from '../models/department.model';

@Injectable({providedIn: 'root',}) export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // backend URL

  constructor(private http: HttpClient) {}
  
  //Get request data
  requestData(id:string): Observable<any> {   
    return this.http.post(`https://apitest.sense.city/api/1.0/issue/details/${id}`,id).pipe(
      catchError((error) => {
        console.error('Error in /request-page request:', error);
        throw error;})
        )  
  }

  //Check if the request is connected with a review
  checkEvaluationStatus(id:string, cityName:string, departmentName:string): Observable<any> {
    console.log("checkEvaluationStatus: id - cityName - departmentName: ",id, cityName, departmentName )
    let requestParams = new HttpParams()
    .set('cityName', cityName)
    .set('departmentName', departmentName)

    return this.http.get(`${this.baseUrl}/check-evaluation-status/${id}`, {params: requestParams})
      .pipe(
        catchError((error) => {
          console.error(`Error in /check-evaluation-status/${id}:`, error);
          throw error;
        })
      );
  }

  //Post message from request-not completed scenario

  saveMessage(comment: String, id: string): void {   
    //request ID that should be re-opened  + declared in the function
    // const postData ={ reID: , message: message }; 
    const postData = { comment: comment};
    console.log('postData: ', postData)
    this.http.post(`${this.baseUrl}/open-request/${id}`, postData).subscribe(respData =>{
      console.log("response: ",respData)
    })
  }

  // saveMessage(comment: String, id: string): void {   
  //   //request ID that should be re-opened  + declared in the function
  //   // const postData ={ reID: , message: message }; 
  //   const postData = { comment: comment};
  //   console.log('postData: ', postData)
  //   this.http.post(`https://apitest.sense.city/api/1.0/review/reopen/issue/${id}`, postData).subscribe(respData =>{
  //     console.log("response: ",respData)
  //   })
  // }

  //Get evauation's questions
  getQuestions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/evaluation-form`)
      .pipe(
        catchError((error) => {
          console.error('Error in /questions request:', error);
          throw error;
        })
      );
  }

  //Post evaluation data
  saveEvaluationData(requestID: string, evaluationID: string ,scoresAnswers: Score[], textsAnswers: Text[]): void {
    
    const postData = { requestID:requestID, evaluationID: evaluationID, scores:scoresAnswers, texts:textsAnswers };
   
    // console.log('url: ', this.baseUrl)
    // console.log('postData: ', postData)
    // console.log('scoresAnswers ', scoresAnswers)
    // console.log('textsAnswers ', textsAnswers)
    this.http.post(`${this.baseUrl}/submit-evaluation`, postData).subscribe(respData =>{
      console.log(respData)
    })

  }

  //Get city data
  getCityData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/city-page`)
      .pipe(
        catchError((error) => {
          console.error('Error in /city-page request:', error);
          throw error;
        })
      );
  }
  

//Get department data
getDepartmentByName(cityName: string, departmentName: string): Observable<Department> {
  const url = `${this.baseUrl}/department/${cityName}/${departmentName}`;
  return this.http.get<Department>(url).pipe(
    catchError((error) => {
      // console.error(`Error in ${this.baseUrl}/department/${cityName}/${departmentName}request:`, error);
      console.error('Error in /department-page request:', error);
      throw error;
    })
  );;
}

// Get department data for specific dates
datesFilter( cityName: string, departmentName: string, startDate: string | null, endDate: string | null): Observable<any> {
  let requestParams = new HttpParams()
  .set('cityName', cityName)
  .set('departmentName', departmentName)
  .set('startDate', startDate ? startDate : '')
  .set('endDate', endDate ? endDate : '');

  return this.http.get(`${this.baseUrl}/filter-data-date`,{ params: requestParams })
      .pipe(
        catchError((error) => {
          console.error('Error in GET request:', error);
          throw error;
        })
      );
}
}


