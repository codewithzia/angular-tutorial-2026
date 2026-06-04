export interface TicketOrder {
  id?: string;
  city: string;
  date: string;
  quantity: number;
  email: string;
  unitPrice: number;
  totalPrice: number;
  createdAt?: Date;
}
