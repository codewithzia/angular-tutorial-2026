import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../models/tour';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-tour-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList  implements OnInit  {
  ngOnInit(): void {
    this.loadTours();
  }
  showModal = false;
  submitSuccess = false;
  editingTourId: string | null = null;
  message: string | null = null;

  tours = signal<Tour[]>([]);


    private readonly fb = inject(FormBuilder);
    private readonly tourService = inject(TourService);

  newTourForm: FormGroup = this.fb.group({
    name: ['',Validators.required],
    description: ['',Validators.required],
    price: [0,Validators.required],
    image: ['https://www.w3schools.com/w3images/newyork.jpg'],
    date: ['',Validators.required],
    location: ['',Validators.required],
    capacity: [0],
    available: [0],
    
  });

  loadTours(): void {
    this.tourService.getAllTours().subscribe((tours) => {
      setTimeout(() => {
        this.tours.set(tours);
        console.log('Tours loaded:', this.tours());
      }, 0);
    });
  }


  openModal(): void {
    this.showModal = true;
    this.submitSuccess = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTourId = null;
    this.newTourForm.reset({ price: 0, capacity: 0, available: 0, image: 'https://www.w3schools.com/w3images/newyork.jpg' });
  }

  onAddNew(): void {
    this.editingTourId = null;
    this.newTourForm.reset({ price: 0, capacity: 0, available: 0, image: 'https://www.w3schools.com/w3images/newyork.jpg' });
    this.openModal();
  }

  onEdit(tour: Tour): void {
    this.editingTourId = tour.id;
    this.newTourForm.patchValue({
      name: tour.name,
      description: tour.description,
      price: tour.price,
      image: tour.image,
      date: tour.date,
      location: tour.location,
      capacity: tour.capacity,
      available: tour.available,
    });
    this.openModal();
  }

  onSubmit(): void {
    if (this.newTourForm.valid) {
      const formValue = this.newTourForm.value;
      if (this.editingTourId) {
        const updatedTour: Tour = {
          id: this.editingTourId,
          ...formValue,
          updatedAt: new Date(),
        };
        this.tourService.updateTour(updatedTour).subscribe(
          () => {
            this.loadTours();
          }
        );
      } else {
        const newTour: Tour = {
          ...formValue,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        //this.tours.push(newTour);
        this.tourService.saveTour(newTour).subscribe(
          () => {
            this.loadTours();
          }
        );
      }
      this.submitSuccess = true;
      setTimeout(() => this.closeModal(), 1200);
    }
  }

  onDelete(tour: Tour): void {
    this.tourService.removeTour(tour.id).subscribe(
      () => {
        this.loadTours();
        // TODO: Show success message
        console.log('Tour deleted successfully');
        this.message = 'Tour deleted successfully';
        setTimeout(() => {
          this.message = null;
        }, 3000);
        
      }
    );
  }

}
