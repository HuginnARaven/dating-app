import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css'
})
export class StarButton {
  isSelected = input<boolean>();
  isDisabled = input<boolean>();
  clickEvent = output<Event>();

  onClick(event: Event){
    this.clickEvent.emit(event)
  }
}
