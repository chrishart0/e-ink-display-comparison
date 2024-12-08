import { Display } from "@/types/Display";

export const displays: Display[] = [
  {
    brand: "Dasung",
    model: "Paperlike 253",
    screen_size: 25.3,
    color_mode: "Grayscale",
    resolution: "3200x1800",
    refresh_rate: null,
    connectivity: ["HDMI", "USB-C", "DisplayPort"],
    compatibility: ["Windows", "Mac", "Linux"],
    touchscreen: false,
    vesa_mount: true,
    front_light: true,
    speakers: true,
    weight_grams: null,
    price: {
      min: 1799,
      max: 2400,
    },
    links: {
      product:
        "https://shop.dasung.com/products/dasung-paperlike-253-world-first-25-3-e-ink-monitor",
      reviews: [
        "https://goodereader.com/blog/reviews/dasung-paperlike-253-dark-knight-edition",
      ],
    },
    ratings: [
      {
        rating_avg: 4.2,
        rating_out_of: 5,
        count: 100,
        link: "https://goodereader.com/blog/reviews/dasung-paperlike-253-dark-knight-edition",
        positive_feedback: "Eye-friendly, reduces headaches",
        negative_feedback: "High price point",
      },
    ],
  },
  // Add more entries here
];