import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-request-not-completed',
  templateUrl: './request-not-completed.component.html',
  styleUrls: ['./request-not-completed.component.css']
})
export class RequestNotCompletedComponent implements OnInit{
  messageForm!: FormGroup;
  isMessageNotEmpty = false;
  requestID!: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService){
    this.messageForm=this.fb.group({
      message:''
    })

  }

  ngOnInit(){
    const messageControl = this.messageForm.get('message');
    if (messageControl) {
      messageControl.valueChanges.subscribe(value => {
        this.isMessageNotEmpty = !!value;
      });
    }
    this.requestID = this.route.snapshot.params['requestID'];
    console.log("request ID: ", this.route.snapshot.params['requestID']);
  }

  submit(){
    // --------before B endpoints--------// 
    // console.log("message: ", this.messageForm.value.message);
    // console.log("type of message: ", typeof(this.messageForm.value.message));

    // ++request ID that should be re-opened 
    // this.apiService.saveMessage(this.messageForm.value.message);
    // this.router.navigate(['/formDone']);
    // -------------------------------- //

    this.apiService.saveMessage(this.messageForm.value.message, this.requestID);
    this.router.navigate([`${this.requestID}/formDone`]);
  }

}

