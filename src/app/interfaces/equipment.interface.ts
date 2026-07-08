export interface Equipment {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  priceDay: number;
  description: string;
  lengthValue?: number | null;
  lengthUnit?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}