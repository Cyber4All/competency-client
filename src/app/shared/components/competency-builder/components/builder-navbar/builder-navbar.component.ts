import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../../../../../core/builder/builder.service';

@Component({
  selector: 'cc-builder-navbar',
  templateUrl: './builder-navbar.component.html',
  styleUrls: ['./builder-navbar.component.scss']
})
export class BuilderNavbarComponent implements OnInit {
  @Input() currIndex!: number;

  constructor(
    public builderService: BuilderService,
  ) { }

  ngOnInit(): void {}

}
