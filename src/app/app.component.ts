import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameClientService, ConnectionStatus } from './game-client/game-client.service';

// import * as WebSocket from 'ws';
// import { setInterval } from 'timers';

// const ws = new WebSocket('ws://localhost:8999');

// let x = 0;
// let my_id: number = 0;
// let positions: {x: number, y: number}[];

// ws.onopen = function (event) {
//   // ws.send("Im alive!"); 
// };

// // setInterval(() => {
// //   ws.send(`Ping number ${x}`);
// //   x += 1;
// // }, 1000);

// ws.onmessage = function (event) {
//   console.log(event.data);
//   const data: any = JSON.parse(event.data);
//   if (data.id !== undefined) {
//     my_id = data.id;
//   } else {
//     positions = data;
//   }
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  // public x: number = 100;
  // public y: number = 100;
  // public context: CanvasRenderingContext2D;
  // @ViewChild('canvas') myCanvas: ElementRef;
  public playerName: string = '';

  constructor(private gameClientService: GameClientService) {
  }

  public isFindingMatchOpen(): boolean {
    return this.gameClientService.getConnectionStatus() === ConnectionStatus.FINDING_MATCH;
  }

  public isMainMenuOpen(): boolean {
    return this.gameClientService.getConnectionStatus() !== ConnectionStatus.MATCH_IN_PROGRESS;
  }

  public isGameClientOpen(): boolean {
    return this.gameClientService.getConnectionStatus() === ConnectionStatus.MATCH_IN_PROGRESS;
  }

  public onClickFindMatch(): void {
    this.gameClientService.connect(this.playerName);
  }

  ngAfterViewInit() {
    // let canvas = this.myCanvas.nativeElement;
    // this.context = canvas.getContext("2d");
    // this.tick();
  }

  // tick() {
  //   requestAnimationFrame(()=> {
  //     this.tick()
  //   });

  //   var ctx = this.context;
  //   ctx.clearRect(0, 0, 400, 400);

  //   let idx = 0;
  //   for (let position of positions) {
  //     ctx.fillStyle = idx === my_id ? "#ff0000" : "#0000ff";
  //     ctx.fillRect(position.x, position.y, 10, 10);
  //     idx += 1;
  //   }

  //   ws.send(JSON.stringify({x: this.x, y: this.y}));
  // }
}
