export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  imageUrl: string;
  fallbackUrl: string;
  badge?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Festive Collection 2024",
    subtitle: "Discover handcrafted elegance in every thread — exclusive festive arrivals now live.",
    cta: "Shop Festive",
    ctaHref: "/products",
    badge: "New Arrival",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2400&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Women's Collection",
    subtitle: "Sarees, salwar kameez and more — woven with tradition, worn with pride.",
    cta: "Explore Women",
    ctaHref: "/products",
    badge: "Best Sellers",
    imageUrl:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2400&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Home & Lifestyle",
    subtitle: "Transform your space with artisan-crafted home goods, pottery and décor.",
    cta: "Shop Home",
    ctaHref: "/products",
    badge: "New In",
    imageUrl:
      "https://images.unsplash.com/photo-1526057565006-20beab8dd2ed?q=80&w=2400&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2400&auto=format&fit=crop",
  },
];
