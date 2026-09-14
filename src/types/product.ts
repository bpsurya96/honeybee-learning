export interface Product {
  is_deleted?: boolean;
  id: string | number;
  title: string;
  price: number;
  badge?: string;
  badgeType?: string;
  image: string;
  images?: string[];
  fallbackEmoji?: string;
  shortDesc?: string;
  fullDesc?: string;
  tags?: string[];
  productType: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  freebies?: string[];
  name?: string;
  emoji?: string;
  mrpLabel?: string;
  category?: string;
  hasCandy?: boolean;
  items?: string[];
  isPremium?: boolean;
}

export interface ReturnGift extends Product {
  name: string;
  emoji: string;
  price: number;
  mrpLabel: string;
  category: string;
  hasCandy: boolean;
  items: string[];
}
