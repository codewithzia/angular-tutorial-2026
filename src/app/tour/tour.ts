import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TourTicketService } from '../services/tour-ticket.service';
import { TicketOrder } from '../models/ticket-order';
import { TourService } from '../services/tour.service';
import { Tour } from '../models/tour';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-tour',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tour.html',
  styleUrl: './tour.css',
})
export class TourComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TourTicketService);
  private readonly tourService = inject(TourService);
  private readonly authService = inject(AuthService);

  tours = signal<Tour[]>([]);
  
   ngOnInit(): void {
  this.tourService.getAllTours().subscribe((tours) => {
      setTimeout(() => {
        this.tours.set(tours);
        console.log('Tours loaded:', this.tours());
      }, 0);
    });
  }

  ticketForm: FormGroup = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
    userId: [''],
  });

  showModal = false;
  selectedCity = '';
  selectedDate = '';
  unitPrice = 15;

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  openModal(city: string, date: string): void {
    this.selectedCity = city;
    this.selectedDate = date;
    this.showModal = true;
    this.submitSuccess = false;
    this.submitError = '';
    const userEmail = this.authService.userData()?.email ?? '';
    const userId = this.authService.userData()?.uid ?? '';
    this.ticketForm.reset({ quantity: 1, email: userEmail, userId: userId });
  }

  closeModal(): void {
    this.showModal = false;
    this.submitSuccess = false;
    this.submitError = '';
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const quantity = this.ticketForm.value.quantity as number;
    const order: TicketOrder = {
      userId: this.ticketForm.value.userId as string,
      city: this.selectedCity,
      date: this.selectedDate,
      quantity,
      email: this.ticketForm.value.email as string,
      unitPrice: this.unitPrice,
      totalPrice: this.unitPrice * quantity,
    };

    this.ticketService.saveTicketOrder(order).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.ticketForm.reset({ quantity: 1, email: '' });
      },
      error: (err: unknown) => {
        this.isSubmitting = false;
        this.submitError =
          err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      },
    });
  }
}
