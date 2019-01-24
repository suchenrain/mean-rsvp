import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submitting',
  template: `
    <img src="/assets/images/picman.svg" />
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      img {
        display: inline-block;
        margin: 4px 3px;
        width: 65px;
      }
    `
  ]
})
export class SubmittingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
