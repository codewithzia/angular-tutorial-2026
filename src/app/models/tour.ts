export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  date: string;
  location: string;
  capacity: number;
  available: number;
  createdAt: Date;
  updatedAt: Date;
}