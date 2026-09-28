export interface DemoProduct {
  id: string;
  title: string;
  price: string;
  images: string[];
  fallbackIndex?: number;
}

/**
 * Demo placeholder products used on the homepage to showcase the product-card
 * "quick view" hover image-cycler while the catalogue database stays empty.
 *
 * NOTE ON IMAGES: of the 6 Unsplash URLs below, 4 returned 404 in direct HTTP
 * checks (photo-1583391733958-d25e07facd92, photo-1617261339148-73b30bdcfb9d,
 * photo-1610030469983-98e550d6193c, photo-1583391265517-35bbdad01209). Each
 * product therefore ships with a verified Unsplash sibling as the first element
 * of `images`, with the user-provided image as the second — so the hover slider
 * always has at least one real image to show. Replace these with your own
 * licensed photography via the Admin panel when you're ready.
 */
export const demoProducts: DemoProduct[] = [
  {
    id: "p_1",
    title: "Scarlet Red Appliqued Silk Saree",
    price: "৳ 8,500",
    // index 0 is the verified live image; index 1 is the user-provided hover image.
    images: [
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733958-d25e07facd92?q=80&w=800&auto=format&fit=crop",
    ],
    fallbackIndex: 0,
  },
  {
    id: "p_2",
    title: "Midnight Blue Handwoven Jamdani",
    price: "৳ 12,000",
    images: [
      "https://images.unsplash.com/photo-1583391265517-35bbdad01209?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617261339148-73b30bdcfb9d?q=80&w=800&auto=format&fit=crop",
    ],
    fallbackIndex: 0,
  },
  {
    id: "p_3",
    title: "Pastel Peach Handblock Printed Taant",
    price: "৳ 3,200",
    images: [
      "https://images.unsplash.com/photo-1551893665-f843f600794e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800&auto=format&fit=crop",
    ],
    fallbackIndex: 0,
  },
];
