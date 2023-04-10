import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../../../../../core/builder.service';

@Component({
  selector: 'cc-builder-navbar',
  templateUrl: './builder-navbar.component.html',
  styleUrls: ['./builder-navbar.component.scss']
})
export class BuilderNavbarComponent implements OnInit {
  currIndex!: number;

  constructor(
    public builderService: BuilderService,
  ) { }

  ngOnInit(): void {
    this.builderService.builderIndex.subscribe((index: number) => {
      this.currIndex = index;
    });
  }

}
