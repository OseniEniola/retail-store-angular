import { Product } from "./products.model";

export interface CartItems{
    product: Product
    quantity: number
}

export interface DiscountCode{
    code: string
    discountAmount: number
    dicountType: string
}

export const discountCodes: DiscountCode[] = [
    {
      code: "SAVE10",
      discountAmount: 10,
      dicountType: "percentage"
    },
    {
      code: "SAVE5",
      discountAmount: 5,
      dicountType: "fixed" 
    }
  ];