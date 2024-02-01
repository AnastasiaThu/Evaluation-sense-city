// denied-evaluation.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-denied-evaluation-access',
  templateUrl: './denied-evaluation-access.component.html',
  styleUrls: ['./denied-evaluation-access.component.css']
})
export class DeniedEvaluationAccessComponent implements OnInit {

  message: string = '';
  requestID: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.message = params['message'];
      this.requestID = params['requestID'];
    });
    // console.log("denied-evaluation-access - message: ", this.message, this.requestID);
  }

  navigateBack() {
    // Example: Navigate back to the home component
    this.router.navigate(['/']);
  }
}
