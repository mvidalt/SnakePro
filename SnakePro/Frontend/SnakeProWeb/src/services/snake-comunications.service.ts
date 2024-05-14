import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {CellType} from "../common/Board";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SnakeComunicationsService {
  private hubConnection: signalR.HubConnection;

  boardArray: CellType[][] = [];

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5273/chathub")
      .build();

    this.hubConnection.on("ReceiveMessage", (message) => {
      console.log("Message received: ", message);
    });
    this.hubConnection.on("ReceiveBoard", (boardArray: CellType[][]) => {
      this.boardArray = boardArray;
    });
  }

  public async startConnection(): Promise<void> {
    try {
      await this.hubConnection
        .start();
      return console.log('Connection started');
    } catch (err) {
      return console.log('Error while starting connection: ' + err);
    }
  }

  public sendMessage(message: string): void {
    this.hubConnection
      .invoke("SendMessage", message)
      .catch(err => console.error(err));
  }

  public sendBoard(columns : number , rows : number): void {
    this.hubConnection
      .invoke("SendBoard", columns, rows)
      .catch(err => console.error(err));
  }

  public getBoardArray(): CellType[][] {
    return this.boardArray;
  }

}
