import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  boardCols = new FormControl(20, [Validators.min(10), Validators.max(30)]);
  boardRows = new FormControl(20, [Validators.min(10), Validators.max(30)]);
  snakeColor: string = '#6dbb31';

  constructor(public snakeCommunicationsService: SnakeCommunicationsService) {
  }

  ngOnInit() {
    const savedboardCols = localStorage.getItem('boardCols');
    if (savedboardCols !== null) {
      this.boardCols.setValue(+savedboardCols);
    }
    const savedboardRows = localStorage.getItem('boardRows');
    if (savedboardRows !== null) {
      this.boardRows.setValue(+savedboardRows);
    }

    // Subscribe to changes in boardCols and update boardRows accordingly
    this.boardCols.valueChanges.subscribe(value => {
      this.boardRows.setValue(value, {emitEvent: false});
    });

    // Subscribe to changes in boardRows and update boardCols accordingly
    this.boardRows.valueChanges.subscribe(value => {
      this.boardCols.setValue(value, {emitEvent: false});
    });
    const savedColor = localStorage.getItem('snakeColor');
    if (savedColor) {
      this.snakeColor = savedColor;
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    } else {
      this.snakeColor = '#6dbb31'; // default snake color
      localStorage.setItem('snakeColor', this.snakeColor);
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    }
  }

  saveSettings() {
    const boardColsItem = localStorage.getItem('boardCols');
    const boardRowsItem = localStorage.getItem('boardRows');
    const oldBoardColsValue = boardColsItem ? +boardColsItem : 20;
    const oldBoardRowsValue = boardRowsItem ? +boardRowsItem : 20;

    let newBoardColsValue = this.boardCols.value ?? oldBoardColsValue;
    let newBoardRowsValue = this.boardRows.value ?? oldBoardRowsValue;

    if (newBoardColsValue > 30 || newBoardColsValue < 10) {
      newBoardColsValue = oldBoardColsValue;
    }
    if (newBoardRowsValue > 30 || newBoardRowsValue < 10) {
      newBoardRowsValue = oldBoardRowsValue;
    }

    localStorage.setItem('boardCols', newBoardColsValue.toString());
    localStorage.setItem('boardRows', newBoardRowsValue.toString());
    localStorage.setItem('snakeColor', this.snakeColor);
    document.documentElement.style.setProperty('--snake-color', this.snakeColor);
  }

  closeSettings() {
    this.close.emit();
  }
}
