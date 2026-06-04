import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { TicketOrder } from '../models/ticket-order';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourTicketService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly ordersCollection: CollectionReference = collection(
    this.firestore,
    'ticketOrders'
  );

  saveTicketOrder(order: TicketOrder): Observable<string> {
    const payload = {
      ...order,
      createdAt: new Date(),
    };
    return from(
      addDoc(this.ordersCollection, payload).then((docRef: { id: string }) => docRef.id)
    );
  }
}
