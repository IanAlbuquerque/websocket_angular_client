import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

export enum ConnectionStatus {
  DISCONNECTED,
  CONNECTED,
  FINDING_MATCH,
  MATCH_IN_PROGRESS
}

export enum ServerClientMessageType {
  FINDING_MATCH,
  MATCH_TICK,
  MATCH_CHAT
}

export interface ServerClientMessage {
  type: ServerClientMessageType
  data?: any
}

export enum ClientServerMessageType {
  CREATE,
  CHAT
}

export interface ClientServerMessage {
  type: ClientServerMessageType
  data?: any
}

export interface MatchChatData {
  timestamp: string;
  playerName: string;
  text: string;
}

export interface ClientChat {
  text: string;
}

@Injectable()
export class GameClientService {

  private ws: WebSocket = undefined;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;

  public onMatchChat: EventEmitter<MatchChatData> = new EventEmitter<MatchChatData>();

  constructor() { }

  private send(msg: ClientServerMessage): void {
    this.ws.send(JSON.stringify(msg));
  }

  public connect(name: string): void {
    this.ws = new WebSocket(environment.gameClientWebsocket);

    this.ws.onopen = (event: Event) => {
      this.send({ type: ClientServerMessageType.CREATE, data: { name: name }})
      this.connectionStatus = ConnectionStatus.CONNECTED;
    };

    this.ws.onclose = (event: Event) => {
      this.connectionStatus = ConnectionStatus.DISCONNECTED;
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const msg: ServerClientMessage = JSON.parse(event.data);
      if (msg.type === ServerClientMessageType.FINDING_MATCH) {
        this.connectionStatus = ConnectionStatus.FINDING_MATCH;
      }
      if (msg.type === ServerClientMessageType.MATCH_TICK) {
        this.connectionStatus = ConnectionStatus.MATCH_IN_PROGRESS;
      }
      if (msg.type === ServerClientMessageType.MATCH_CHAT) {
        this.onMatchChat.emit(msg.data);
      }
    };
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public sendChat(text: string): void {
    const data: ClientChat = { text: text };
    this.send({ type: ClientServerMessageType.CHAT, data: data})
  }

}
