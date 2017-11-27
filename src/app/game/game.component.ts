import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameClientService, MatchChatData } from '../game-client/game-client.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  public chat: MatchChatData[] = [];
  public chatInput: string = '';

  public context: CanvasRenderingContext2D;
  @ViewChild('canvas') myCanvas: ElementRef;

  constructor(private gameClientService: GameClientService) {
    this.gameClientService.onMatchChat.subscribe((matchChatData: MatchChatData) => {
      this.chat.push(matchChatData);
    })
  }

  public matchChatDataToString(matchChatData: MatchChatData): string {
    const date = new Date(matchChatData.timestamp);
    const hours = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `[${hours}:${mins}:${secs}] ${matchChatData.playerName}: ${matchChatData.text}`;
  }

  public onClickSendChat(): void {
    this.gameClientService.sendChat(this.chatInput);
    this.chatInput = '';
  }

  ngAfterViewInit() {
    let canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext("2d");
    this.tick();
  }

  private tick() {
    requestAnimationFrame(()=> {
      this.tick()
    });

    var ctx = this.context;
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(100, 200, 100, 200);

    // let idx = 0;
    // // for (let position of positions) {
    // //   ctx.fillStyle = idx === my_id ? "#ff0000" : "#0000ff";
    // //   ctx.fillRect(position.x, position.y, 10, 10);
    // //   idx += 1;
    // // }

    // ws.send(JSON.stringify({x: this.x, y: this.y}));
  }

}
