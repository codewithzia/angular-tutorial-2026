import { Component } from '@angular/core';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrl: './tour.component.css'
})
export class TourComponent {
  showTicketModal = false;

  openTicketModal() {
    this.showTicketModal = true;
  }

  closeTicketModal() {
    this.showTicketModal = false;
  }
}
