import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-competencies-dashboard',
  templateUrl: './competencies-dashboard.component.html',
  styleUrls: ['./competencies-dashboard.component.scss']
})
export class CompetenciesDashboardComponent implements OnInit {

  competencies = [
    {
      _id: "123455",
      audience: "the student Acting as a Network operations specialist and given a network(2) with with a connectivity issue (3), will",
      behavior: "",
      condition: "Diagnose network connectivity problem(4 -T0081) and fix",
      degree: "",
      effectiveness: "",
      author: "",
      locked: false,
      lastUpdate: ""
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
