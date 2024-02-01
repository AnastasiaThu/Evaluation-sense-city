import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  requestID!: string;
  evaluationID!: string;
  // submissionDate!: Date;
  reviewAccess!: number;
  requestStatus!: string;
  city!: string;         //municipality
  department!: string;
  reviewStatus!: string;

  ngOnInit(): void {
    //Get user data 

    //Get requestID from the url
    this.requestID = this.route.snapshot.params['requestID'];
    console.log("ngOnInit - request ID: ", this.requestID, typeof(this.requestID));

    // Check if request can be evaluated and get its data
    this.apiService.requestData(this.requestID).subscribe((data)=>{ 
      console.log("requestData at /issue/details/:id returns ",data);
      this.reviewAccess = data.reviewAccess;
      this.requestStatus = data.status;
      this.city = data.municipality;
      this.department = data.department;

      console.log("type of reviewAccess, value, comparison with 1: ",typeof(this.reviewAccess), this.reviewAccess, this.reviewAccess===1)
      //Check the requests validity using the api (print message page)    
      if(this.reviewAccess === 1){
        console.log("inside if")
        this.apiService.checkEvaluationStatus(this.requestID, this.city, this.department).subscribe((data)=>{
          
           console.log("data: ", data);
          //Check if the request is connected with a review
          //if yes check and the status review is done -> print message page
          //if yes check and the status review is pending -> send the review and go to review page
          //if no -> create a new review and connect it to the reqID -> send the review and go to review page
          
          if(data.statusCode===0){
              //load page sorry evaluation already completed //passing message "evauation already done" to params
              this.evaluationAccessDenied(data.message);
          }
          else{
            this.evaluationID = data.evaluation._id;   //evaluation.evaluationID  ????
            console.log("home - evaluationID: ", this.evaluationID)
            //load home page = do nothing //change? goTo HomePage
          }
          
        })
      }
      else{
        //load page sorry time for evaluation expired //passing message "evauation time expired" to params
        this.evaluationAccessDenied(data.message);
      }

      })
           
  }

  evaluationAccessDenied(message: string){
    this.router.navigate([`${this.requestID}/evaluation/denied`, { message }]);
    //http://localhost:4200/reviews/evaluation/denied/65a2ccd65713b16acc72db72;message=undefined
  }

  //Send user data to check if he has done other evaluations too
  navigateToYes() {
    this.router.navigate(['reqDone'],{relativeTo:this.route, queryParams: {evaluationID: this.evaluationID}}); 
    //http://localhost:4200/reviews/65a2ccd65713b16acc72db72/reqDone
  }

  navigateToNo() {
    this.router.navigate(['reqPending'],{relativeTo:this.route}); 
  }
}
