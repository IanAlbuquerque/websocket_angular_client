import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Msg from './msg';

export enum ConnectionStatus {
  DISCONNECTED,
  CONNECTED,
  FINDING_MATCH,
  MATCH_IN_PROGRESS
}

@Injectable()
export class GameClientService {

  private ws: WebSocket = undefined;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;

  public onMatchChat: EventEmitter<Msg.SCChat> = new EventEmitter<Msg.SCChat>();
  public onMatchTick: EventEmitter<Msg.SCChat> = new EventEmitter<Msg.SCChat>();

  constructor() { }

  private send(msg: Msg.CS): void {
    this.ws.send(JSON.stringify(msg));
  }

  public connect(name: string): void {
    this.ws = new WebSocket(environment.gameClientWebsocket);

    this.ws.onopen = (event: Event) => {
      const msg: Msg.CSCreateClient = {
        type: Msg.CSType.CSCreateClient,
        name: name
      }
      this.send(msg);
      this.connectionStatus = ConnectionStatus.CONNECTED;
    };

    this.ws.onclose = (event: Event) => {
      this.connectionStatus = ConnectionStatus.DISCONNECTED;
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const msg: Msg.SC = JSON.parse(event.data);
      if (msg.type === Msg.SCType.SCFindingMatch) {
        this.connectionStatus = ConnectionStatus.FINDING_MATCH;
      }
      if (msg.type === Msg.SCType.SCMatchTick) {
        this.connectionStatus = ConnectionStatus.MATCH_IN_PROGRESS;
        this.onMatchTick.emit(msg as Msg.SCChat);
      }
      if (msg.type === Msg.SCType.SCChat) {
        this.onMatchChat.emit(msg as Msg.SCChat);
      }
    };
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public sendChat(text: string): void {
    const data: Msg.CSChat = {
      type: Msg.CSType.CSChat,
      text: text 
    };
    this.send(data);
  }

  public sendMovementStart(movement: Msg.PlayerMovement): void {
    const data: Msg.CSMoveStart = {
      type: Msg.CSType.CSMoveStart,
      movement: movement
    };
    this.send(data); 
  }
  
  public sendMovementEnd(movement: Msg.PlayerMovement): void {
    const data: Msg.CSMoveEnd = {
      type: Msg.CSType.CSMoveEnd,
      movement: movement
    };
    this.send(data); 
  }

}
