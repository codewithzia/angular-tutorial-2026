import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Tour } from '../models/tour';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly toursCollection: CollectionReference = collection(
    this.firestore,
    'tours'
  );

  saveTour(tour: Tour): Observable<string> {
    const payload = {
      ...tour,
      createdAt: new Date(),
    };
    return from(
      addDoc(this.toursCollection, payload).then((docRef: { id: string }) => docRef.id)
    );
  }

  getAllTours(): Observable<Tour[]> {
    // TODO: Implement this method
    return from(
      getDocs(this.toursCollection).then((snapshot) => {
        const tours: Tour[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<Tour, 'id'>;
          tours.push({ id: docSnap.id, ...data });
        });
        return tours;
      })
    );
  }

  updateTour(tour: Tour): Observable<void> {
    debugger
    const tourDoc = doc(this.firestore, 'tours', tour.id);
    const payload = {
      ...tour,
      updatedAt: new Date(),
    };
    return from(updateDoc(tourDoc, payload));
  }

  removeTour(tourId: string): Observable<void> {
    const tourDoc = doc(this.firestore, 'tours', tourId);
    return from(deleteDoc(tourDoc));
  }
}
