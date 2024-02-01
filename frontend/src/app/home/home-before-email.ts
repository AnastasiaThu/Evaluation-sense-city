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
  // reviewID!: string;
  // // submissionDate!: Date;
  // reviewAccess!: number;
  // requestStatus!: string;
  // city!: string;         //municipality
  // department!: string;
  // reviewStatus!: string;

  // code: number = 0;


  ngOnInit(): void {
    
    this.requestID = this.route.snapshot.params['requestID'];
    console.log("ngOnInit - request ID: ", this.requestID, typeof(this.requestID));
    //after email checks to be written here 
  }

  // evaluationAccessDenied(message: string){
  //   this.router.navigate(['/evaluation/denied', this.requestID, { message }]);
  // }

  navigateToYes() {
    this.router.navigate(['reqDone'],{relativeTo:this.route}); 
  }

  navigateToNo() {
    this.router.navigate(['reqPending'],{relativeTo:this.route}); 
  }
}