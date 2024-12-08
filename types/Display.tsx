export interface Display {
    brand: string;
    model: string;
    screen_size: number;
    color_mode: string;
    resolution: string;
    refresh_rate: number | null;
    connectivity: string[];
    compatibility?: string[];
    touchscreen?: boolean;
    vesa_mount?: boolean;
    front_light?: boolean;
    speakers?: boolean;
    weight_grams?: number | null;
    links: {
      product: string;
      reviews: string[];
    };
    ratings?: Ratings[];
    price: {
      min: number;
      max: number;
    };
    release_date?: Date;
    stock_status?: 'in_stock' | 'out_of_stock' | 'backordered';
    warranty_period?: string;
    images?: string[];
    seo?: {
      meta_title: string;
      meta_description: string;
      keywords: string[];
    };
  }

interface Ratings {
  rating_avg: number;
  rating_out_of: number;
  count: number;
  link: string;
  positive_feedback?: string;
  negative_feedback?: string;
}