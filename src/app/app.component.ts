import { Component } from '@angular/core';
// import * as WebSocket from 'ws';
// import { setInterval } from 'timers';

const ws = new WebSocket('ws://localhost:8999');

let x = 0;

ws.onopen = function (event) {
  ws.send("Im alive!"); 
};

setInterval(() => {
  ws.send(`Ping number ${x}`);
  x += 1;
}, 1000);

ws.onmessage = function (event) {
  console.log(event.data);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'app';

  constructor() {
  }
}
