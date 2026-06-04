import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TourTicketService } from '../services/tour-ticket.service';
import { TicketOrder } from '../models/ticket-order';

@Component({
  selector: 'app-tour',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tour.html',
  styleUrl: './tour.css',
})
export class Tour {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TourTicketService);

  ticketForm: FormGroup = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
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
    this.ticketForm.reset({ quantity: 1, email: '' });
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
