import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <img src="/assets/images/loading.svg" />
  `,
  styles: [
    `
      :host {
        display: block;
      }
      img {
        display: block;
        margin: 20px auto;
        width: 13rem;
      }
    `
  ]
})
export class LoadingComponent {}
