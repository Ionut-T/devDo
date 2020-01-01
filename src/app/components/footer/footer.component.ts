import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  interval: string;

  /**
   * Display interval.
   */
  ngOnInit() {
    const birthYear = 2019;
    const currentYear = new Date().getFullYear();

    this.interval = `${birthYear} - ${currentYear}`;
  }
}
