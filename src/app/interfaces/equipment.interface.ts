export interface Equipment {
  _id: string;        
  name: string;
  category: string;
  price: number;
  available: boolean;
  description?: string;
}