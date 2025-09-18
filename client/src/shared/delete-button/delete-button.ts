import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.css'
})
export class DeleteButton {
  clickEvent = output<Event>();
  isDisabled = input<boolean>();

  onClick(event: Event){
    this.clickEvent.emit(event)
  }
}
