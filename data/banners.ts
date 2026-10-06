export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  imageUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  alignment?: 'left' | 'center' | 'right';
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    tagline: 'THE HERITAGE WEAVE',
    title: 'Dhakai Jamdani & Royal Muslin',
    subtitle: 'Reviving the centuries-old artisanal mastery of Bengal handloom weavers. Gossamer drapes, antique zari jaal, and bespoke bridal elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'EXPLORE SAREES',
    primaryCtaLink: '/women/saree',
    secondaryCtaText: 'OUR CRAFT STORY',
    secondaryCtaLink: '/special-collections',
    alignment: 'left',
  },
  {
    id: 'slide-2',
    tagline: 'FESTIVE COUTURE 2026',
    title: 'The Royal Panjabi & Sherwani Series',
    subtitle: 'Pure Rajshahi mulberry silks, fine Comilla khadi, and hand-embroidered collars crafted for celebrations of distinction.',
    imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'SHOP MEN’S FESTIVE',
    primaryCtaLink: '/men/panjabi',
    secondaryCtaText: 'VIEW LOOKBOOK',
    secondaryCtaLink: '/men',
    alignment: 'left',
  },
  {
    id: 'slide-3',
    tagline: 'BENGAL ARTISANAL LIVING',
    title: 'Heirloom Living & Handcrafted Brass',
    subtitle: 'Intricate Nakshi Kantha quilts, hand-thrown terracotta urlis, and lost-wax brassware bringing warmth to modern homes.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'DISCOVER HOME DÉCOR',
    primaryCtaLink: '/home-decor',
    secondaryCtaText: 'ARTISAN GIFTS',
    secondaryCtaLink: '/gifts-crafts',
    alignment: 'left',
  },
];

export const promotionalEditorialBanners = [
  {
    id: 'promo-1',
    kicker: 'WEDDING ATELIER',
    title: 'Bridal Trousseau & Heritage Katan',
    description: 'Each bridal katan is hand-embossed with gold zari paisleys by third-generation master weavers in Mirpur.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    link: '/wedding',
    cta: 'EXPLORE BRIDAL',
  },
  {
    id: 'promo-2',
    kicker: 'NOBLE JEWELS',
    title: '22K Kundan, Polki & River Pearls',
    description: 'Nawabi-inspired chokers, temple bangles, and delicate jhumkas with authentic vintage stone-setting.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    link: '/jewellery',
    cta: 'DISCOVER JEWELLERY',
  },
];
