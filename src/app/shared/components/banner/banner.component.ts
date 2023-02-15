import { Component, OnInit } from '@angular/core';
import { BannerService } from 'src/app/core/banner.service';

@Component({
  selector: 'cc-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  constructor(public bannerService: BannerService) {}

  ngOnInit(): void {}

}
