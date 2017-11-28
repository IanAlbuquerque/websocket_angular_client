import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameClientService } from '../game-client/game-client.service';
import * as Msg from '../game-client/msg';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  private ownPosition: { x: number, y: number } = { x: 0, y: 0 };
  private enemyPositions: { x: number, y: number }[] = [];

  public chat: Msg.SCChat[] = [];
  public chatInput: string = '';

  public context: CanvasRenderingContext2D;
  private canvasWidth = 0;
  private canvasHeight = 0;
  @ViewChild('canvas') myCanvas: ElementRef;

  constructor(private gameClientService: GameClientService) {
    this.gameClientService.onMatchChat.subscribe((matchChatData: Msg.SCChat) => {
      this.chat.push(matchChatData);
    })
    this.gameClientService.onMatchTick.subscribe((matchTick: Msg.SCMatchTick) => {
      this.ownPosition = matchTick.ownPosition;
      this.enemyPositions = matchTick.enemyPositions;
    })
  }

  public matchChatDataToString(matchChatData: Msg.SCChat): string {
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

  private onWindowResize(): void {
    let canvas = this.myCanvas.nativeElement;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;  
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) {
      // Do nothing if the event was already processed
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
      case 's':
        this.gameClientService.sendMovementStart(Msg.PlayerMovement.DOWN);
        break;
      case 'ArrowUp':
      case 'w':
      this.gameClientService.sendMovementStart(Msg.PlayerMovement.UP);
        break;
      case 'ArrowLeft':
      case 'a':
      this.gameClientService.sendMovementStart(Msg.PlayerMovement.LEFT);
        break;
      case 'ArrowRight':
      case 'd':
      this.gameClientService.sendMovementStart(Msg.PlayerMovement.RIGHT);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.defaultPrevented) {
      // Do nothing if the event was already processed
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
      case 's':
        this.gameClientService.sendMovementEnd(Msg.PlayerMovement.DOWN);
        break;
      case 'ArrowUp':
      case 'w':
      this.gameClientService.sendMovementEnd(Msg.PlayerMovement.UP);
        break;
      case 'ArrowLeft':
      case 'a':
      this.gameClientService.sendMovementEnd(Msg.PlayerMovement.LEFT);
        break;
      case 'ArrowRight':
      case 'd':
      this.gameClientService.sendMovementEnd(Msg.PlayerMovement.RIGHT);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  ngAfterViewInit() {
    const self = this;
    let canvas = this.myCanvas.nativeElement;
    window.addEventListener('resize', () => {
      self.onWindowResize();
    }, true);
    canvas.addEventListener('keydown', (keyboardEvent: KeyboardEvent) => {
      self.onKeyDown(keyboardEvent);
    }, true)
    canvas.addEventListener('keyup', (keyboardEvent: KeyboardEvent) => {
      self.onKeyUp(keyboardEvent);
    }, true)
    this.context = canvas.getContext("2d");
    this.onWindowResize();
    this.tick();
  }

  private tick() {
    requestAnimationFrame(()=> {
      this.tick()
    });

    var ctx = this.context;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.ownPosition.x, this.ownPosition.y, 25, 25);
    for(const enemyPosition of this.enemyPositions) {
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(enemyPosition.x, enemyPosition.y, 25, 25);
    }
  }

}
