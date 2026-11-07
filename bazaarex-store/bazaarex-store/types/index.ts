export type CategorySlug =
  | "shirts"
  | "t-shirts"
  | "trousers"
  | "jackets"
  | "knitwear";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Price in whole rupees. */
  price: number;
  category: CategorySlug;
  description: string;
  details: string[];
  fabric: string;
  colour: string;
  sizes: string[];
  /** First image is the main shot, second is shown on hover. */
  images: [ProductImage, ProductImage];
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  image: string;
  productSlugs: string[];
}

export interface BagItem {
  slug: string;
  size: string;
  quantity: number;
}
