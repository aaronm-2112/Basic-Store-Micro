// the product interface

export interface ProductModel {
  name: string;
  price: number;
  description: string;
  category: string[];
  imageURI: string;
  quantity: number;
  // the entity selling the product and their contact info
  user: { username: string; email: string };
}
