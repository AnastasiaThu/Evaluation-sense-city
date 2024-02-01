import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  requestID!: string;

  logoRouterLink(): string {
    const currentRoute = this.router.url;
    if(this.route.snapshot.params['requestID']){
      this.requestID = this.route.snapshot.params['requestID'];
    }
  
    if (
      currentRoute.includes(`/${this.requestID}`) ||
      currentRoute.includes('/reqDone') ||
      currentRoute.includes('/reqPending') ||
      currentRoute.includes('/formDone') ||
      currentRoute.includes('/evaluation/denied')
    ) {
      console.log("Logo - inside if: ");
      return `/${this.requestID}`;
    } else {
      console.log("Logo - inside else: ");
      return '/cityPage';
    }
  }
}
