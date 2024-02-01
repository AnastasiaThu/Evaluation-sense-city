import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestCompletedComponent } from './request-completed/request-completed.component'; 
import { RequestNotCompletedComponent } from './request-not-completed/request-not-completed.component'; 
import { FormCompletedComponent } from './form-completed/form-completed.component';
import { CityPageComponent } from './city-page/city-page.component';
import { DepartmentPageComponent } from './department-page/department-page.component';
import { DeniedEvaluationAccessComponent } from './denied-evaluation-access/denied-evaluation-access.component';

// ------------------ before email ------------------ // 
// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'cityPage', component: CityPageComponent },
//   // { path: 'department/:name', component: DepartmentPageComponent },
//   { path: 'department/:city/:name', component: DepartmentPageComponent },
//   { path: ':requestID', component: HomeComponent },
//   { path: 'reqDone', component: RequestCompletedComponent, children: [{ path: 'formDone', component: FormCompletedComponent }] },
//   { path: 'reqPending', component: RequestNotCompletedComponent },
//   { path: 'reqPending/:requestID', component: RequestNotCompletedComponent },
//   { path: 'formDone', component: FormCompletedComponent },

// ];
// ----------------------------------------- // 



const routes: Routes = [
  //{ path: '', redirectTo: ':requestID', pathMatch: 'full' }, // Redirect to HomeComponent
  { path: 'cityPage', component: CityPageComponent },
  { path: 'department/:city/:name', component: DepartmentPageComponent },
  // { path: '', redirectTo: ':requestID'},
  { path: ':requestID', component: HomeComponent },
  { path: ':requestID/reqDone', component: RequestCompletedComponent, children: [{ path: 'formDone', component: FormCompletedComponent }] },
  { path: 'reqPending', component: RequestNotCompletedComponent },
  { path: ':requestID/reqPending', component: RequestNotCompletedComponent },
  { path: ':requestID/formDone', component: FormCompletedComponent },
  { path: ':requestID/evaluation/denied', component: DeniedEvaluationAccessComponent },
];



// const routes: Routes = [
//   //{ path: '', redirectTo: ':requestID', pathMatch: 'full' }, // Redirect to HomeComponent
//   //{ path: '', redirectTo: ':requestID'}, // Redirect to HomeComponent
//   { path: 'cityPage', component: CityPageComponent },
//   { path: 'department/:city/:name', component: DepartmentPageComponent },
//   { path: ':requestID', component: HomeComponent },
//   { path: ':requestID/reqDone', component: RequestCompletedComponent, children: [{ path: 'formDone', component: FormCompletedComponent }] },
//   // { path: 'reqPending', component: RequestNotCompletedComponent },
//   { path: ':requestID/reqPending', component: RequestNotCompletedComponent },
//   { path: ':requestID/formDone', component: FormCompletedComponent },
//   { path: ':requestID/evaluation/denied', component: DeniedEvaluationAccessComponent },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
