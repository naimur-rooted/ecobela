import { NavCategory } from '@/types/category';

export const navigationCategories: NavCategory[] = [
  {
    id: 'women',
    name: 'WOMEN',
    slug: 'women',
    href: '/women',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Artisanal Jamdani & Muslin',
      subtitle: 'Hand-woven heritage sarees by master weavers of Bengal',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      link: '/women/saree',
      badge: 'Heritage Craft',
    },
    columns: [
      {
        title: 'Traditional Attire',
        items: [
          { name: 'New Arrivals', slug: 'new-arrivals' },
          {
            name: 'Saree',
            slug: 'saree',
            subItems: [
              { name: 'Jamdani', slug: 'jamdani' },
              { name: 'Muslin', slug: 'muslin' },
              { name: 'Rajshahi Silk', slug: 'silk' },
              { name: 'Katan & Brocade', slug: 'katan' },
              { name: 'Handloom Cotton', slug: 'cotton' },
            ],
          },
          {
            name: 'Shalwar Kameez',
            slug: 'shalwar-kameez',
            subItems: [
              { name: 'Handloom Cotton', slug: 'cotton-suit' },
              { name: 'Embroidered Silk', slug: 'silk-suit' },
              { name: 'Pure Muslin', slug: 'muslin-suit' },
            ],
          },
        ],
      },
      {
        title: 'Contemporary Wear',
        items: [
          { name: 'Kurtas & Tunics', slug: 'kurta' },
          { name: 'Contemporary Tops', slug: 'tops' },
          { name: 'Coats & Jackets', slug: 'coats-jackets' },
          { name: 'Layering Shrugs', slug: 'shrugs' },
          { name: 'Long Skirts', slug: 'skirts' },
          { name: 'Trousers & Pants', slug: 'pants' },
          { name: 'Maternity Comfort', slug: 'maternity' },
        ],
      },
      {
        title: 'Drapes & Layers',
        items: [
          { name: 'Handloom Dupatta', slug: 'dupatta' },
          { name: 'Printed Scarves', slug: 'scarves' },
          { name: 'Kashmiri & Bengal Shawls', slug: 'shawls' },
          { name: 'Loungewear & Nightwear', slug: 'nightwear' },
          { name: 'Unstitched Fabric', slug: 'fabric' },
        ],
      },
      {
        title: 'Footwear & Accessories',
        items: [
          {
            name: 'Footwear',
            slug: 'shoes',
            subItems: [
              { name: 'Handcrafted Sandals', slug: 'sandals' },
              { name: 'Embroidered Heels', slug: 'heels' },
              { name: 'Comfort Pumps', slug: 'pumps' },
            ],
          },
          {
            name: 'Leather & Jute Bags',
            slug: 'bags',
            subItems: [
              { name: 'Tote Bags', slug: 'totes' },
              { name: 'Embroidered Clutches', slug: 'clutches' },
              { name: 'Leather Wallets', slug: 'wallets' },
              { name: 'Card Holders', slug: 'card-holders' },
              { name: 'Handmade Key Rings', slug: 'key-rings' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'men',
    name: 'MEN',
    slug: 'men',
    href: '/men',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Royal Panjabi Collection',
      subtitle: 'Fine tussar, silk & khadi cuts with hand-zari embroidery',
      imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
      link: '/men/panjabi',
      badge: 'Festive Edition',
    },
    columns: [
      {
        title: 'Ethnic & Festive',
        items: [
          { name: 'Festive Panjabi', slug: 'panjabi' },
          { name: 'Casual Short Panjabi', slug: 'short-panjabi' },
          { name: 'Royal Sherwani & Koti', slug: 'sherwani' },
          { name: 'Pajama & Aligarhi Pants', slug: 'pajama' },
          { name: 'Traditional Dhoti', slug: 'dhoti' },
        ],
      },
      {
        title: 'Everyday Apparel',
        items: [
          { name: 'Handloom Khadi Shirts', slug: 'khadi-shirts' },
          { name: 'Linen Casual Shirts', slug: 'linen-shirts' },
          { name: 'Classic Polo Shirts', slug: 'polo' },
          { name: 'Tailored Chinos & Trousers', slug: 'trousers' },
          { name: 'Casual Denims', slug: 'denim' },
        ],
      },
      {
        title: 'Jackets & Shawls',
        items: [
          { name: 'Nehru & Modi Waistcoats', slug: 'waistcoats' },
          { name: 'Pure Pashmina & Wool Shawls', slug: 'men-shawls' },
          { name: 'Winter Blazers', slug: 'blazers' },
          { name: 'Bespoke Suits', slug: 'suits' },
        ],
      },
      {
        title: 'Shoes & Accessories',
        items: [
          { name: 'Handmade Leather Nagra & Mojari', slug: 'nagra' },
          { name: 'Leather Loafers & Oxfords', slug: 'loafers' },
          { name: 'Pure Leather Belts & Wallets', slug: 'men-accessories' },
          { name: 'Brass Cufflinks & Lapel Pins', slug: 'cufflinks' },
        ],
      },
    ],
  },
  {
    id: 'kids',
    name: "KIDS'",
    slug: 'kids',
    href: '/kids',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Little Heritage Ensemble',
      subtitle: 'Soft, breathable festive wear crafted for gentle skin',
      imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
      link: '/kids',
      badge: 'Pure Comfort',
    },
    columns: [
      {
        title: "Girls' Collection",
        items: [
          { name: 'Miniature Sarees', slug: 'mini-saree' },
          { name: 'Brocade Lehengas', slug: 'kids-lehenga' },
          { name: 'Cotton Salwar Sets', slug: 'kids-salwar' },
          { name: 'Embroidered Frocks & Dresses', slug: 'girls-dresses' },
        ],
      },
      {
        title: "Boys' Collection",
        items: [
          { name: 'Kids Festive Panjabi', slug: 'kids-panjabi' },
          { name: 'Koti & Waistcoat Sets', slug: 'kids-koti' },
          { name: 'Cotton Casual Kurta', slug: 'kids-kurta' },
          { name: 'Kids Pajama & Chinos', slug: 'kids-pants' },
        ],
      },
      {
        title: 'Infants & Toddlers',
        items: [
          { name: 'Organic Cotton Rompers', slug: 'rompers' },
          { name: 'Traditional Nima Tops', slug: 'nima' },
          { name: 'Handmade Kantha Blankets', slug: 'baby-kantha' },
          { name: 'Baby Care & Gifting Sets', slug: 'baby-gift' },
        ],
      },
      {
        title: 'Accessories & Toys',
        items: [
          { name: 'Kids Traditional Footwear', slug: 'kids-shoes' },
          { name: 'Hair Accessories & Bangles', slug: 'kids-jewelry' },
          { name: 'Clay & Wooden Toys', slug: 'folk-toys' },
        ],
      },
    ],
  },
  {
    id: 'home-decor',
    name: 'HOME DÉCOR',
    slug: 'home-decor',
    href: '/home-decor',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Bengal Heritage Living',
      subtitle: 'Artisanal terracotta, brass heirlooms & nakshi kantha throws',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      link: '/home-decor',
      badge: 'Master Crafted',
    },
    columns: [
      {
        title: 'Living & Accent',
        items: [
          { name: 'Hand-embroidered Cushion Covers', slug: 'cushions' },
          { name: 'Heritage Nakshi Kantha Quilts', slug: 'kantha-quilts' },
          { name: 'Hand-woven Jute Rugs & Runners', slug: 'rugs' },
          { name: 'Block-print Curtains', slug: 'curtains' },
        ],
      },
      {
        title: 'Art & Collectibles',
        items: [
          { name: 'Hand-carved Brass Urli & Lanterns', slug: 'brassware' },
          { name: 'Shital Pati Mats & Wall Hangings', slug: 'shital-pati' },
          { name: 'Terracotta Pottery & Vases', slug: 'terracotta' },
          { name: 'Patachitra Folk Paintings', slug: 'folk-art' },
        ],
      },
      {
        title: 'Dining & Kitchenware',
        items: [
          { name: 'Handloom Table Cloths & Runners', slug: 'table-linen' },
          { name: 'Brass & Copper Dinner Sets', slug: 'copper-dining' },
          { name: 'Clay & Ceramic Tea Sets', slug: 'tea-sets' },
          { name: 'Sheesham Wooden Trays & Bowls', slug: 'wooden-trays' },
        ],
      },
      {
        title: 'Aromatherapy & Gifting',
        items: [
          { name: 'Artisan Scented Soy Candles', slug: 'candles' },
          { name: 'Natural Sandalwood Incense', slug: 'incense' },
          { name: 'Essential Oil Diffusers', slug: 'diffusers' },
          { name: 'Housewarming Gift Hampers', slug: 'home-hampers' },
        ],
      },
    ],
  },
  {
    id: 'jewellery',
    name: 'JEWELLERY',
    slug: 'jewellery',
    href: '/jewellery',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Heirloom Jewels & Ornaments',
      subtitle: '22K gold-plated Kundan, Polki, filigree & freshwater pearls',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      link: '/jewellery',
      badge: 'Finest Craft',
    },
    columns: [
      {
        title: 'Neckwear & Chokers',
        items: [
          { name: 'Bridal Kundan Chokers', slug: 'chokers' },
          { name: 'Layered Polki Necklaces', slug: 'necklaces' },
          { name: 'Filigree Gold-Plated Sets', slug: 'filigree-sets' },
          { name: 'Minimalist Pendants', slug: 'pendants' },
        ],
      },
      {
        title: 'Earrings & Jhumkas',
        items: [
          { name: 'Traditional Chandbali', slug: 'chandbali' },
          { name: 'Heritage Jhumkas', slug: 'jhumkas' },
          { name: 'Freshwater Pearl Drops', slug: 'pearl-drops' },
          { name: 'Modern Geometric Studs', slug: 'studs' },
        ],
      },
      {
        title: 'Bangles & Bracelets',
        items: [
          { name: 'Kadas & Temple Bangles', slug: 'kadas' },
          { name: 'Handcrafted Churi Sets', slug: 'churi' },
          { name: 'Meenakari Enamel Cuffs', slug: 'meenakari' },
          { name: 'Silver Tone Bracelets', slug: 'bracelets' },
        ],
      },
      {
        title: 'Bridal Essentials',
        items: [
          { name: 'Matha Patti & Maang Tikka', slug: 'maang-tikka' },
          { name: 'Nath & Nose Rings', slug: 'nath' },
          { name: 'Haathphool & Rings', slug: 'haathphool' },
          { name: 'Payal & Anklets', slug: 'payal' },
        ],
      },
    ],
  },
  {
    id: 'skin-hair',
    name: 'SKIN & HAIR',
    slug: 'skin-hair',
    href: '/skin-hair',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Botanical Earth Care',
      subtitle: 'Pure Ayurvedic wellness, cold-pressed oils & herbal infusions',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      link: '/skin-hair',
      badge: '100% Herbal',
    },
    columns: [
      {
        title: '',
        items: [
          { name: 'NEW ARRIVALS', slug: 'new-arrivals' },
          { name: 'FACE WASHES', slug: 'face-washes' },
          { name: 'FACE PACKS', slug: 'face-packs' },
          { name: 'FACE MASKS', slug: 'face-masks' },
          { name: 'SOOTHING GELS', slug: 'soothing-gels' },
        ],
      },
      {
        title: '',
        items: [
          { name: 'BODY CARE', slug: 'body-care' },
          { name: 'BODY WASHES', slug: 'body-washes' },
          { name: 'HANDMADE SOAPS', slug: 'handmade-soaps' },
          { name: 'HAIR & BODY OILS', slug: 'hair-body-oils' },
          { name: 'HAIR PACKS', slug: 'hair-packs' },
        ],
      },
      {
        title: '',
        items: [
          { name: 'SHAMPOO', slug: 'shampoo' },
          { name: 'BODY LOTION', slug: 'body-lotion' },
          { name: 'LIP BALMS', slug: 'lip-balms' },
          { name: 'CANDLES & DIFFUSERS', slug: 'candles-diffusers' },
          { name: 'ESSENTIAL OILS', slug: 'essential-oils' },
        ],
      },
      {
        title: '',
        items: [
          { name: 'ACCESSORIES', slug: 'accessories' },
          { name: 'GIFT BASKETS', slug: 'gift-baskets' },
          { name: 'SUMMER GLOW', slug: 'summer-glow' },
          { name: 'TONERS', slug: 'toners' },
        ],
      },
    ],
  },
  {
    id: 'gifts-crafts',
    name: 'GIFTS & CRAFTS',
    slug: 'gifts-crafts',
    href: '/gifts-crafts',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Crafts of Bengal',
      subtitle: 'Preserving generational craft traditions across Bangladesh',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      link: '/gifts-crafts',
      badge: 'Master Crafted',
    },
    columns: [
      {
        title: '',
        items: [
          { name: 'GIFT CARDS', slug: 'gift-cards' },
          { name: 'FESTIVE GIFT BOXES', slug: 'festive-gift-boxes' },
          { name: 'EARTH GIFT BASKETS', slug: 'earth-gift-baskets' },
          { name: 'SOUVENIRS', slug: 'souvenirs' },
          { name: 'NOVELTIES', slug: 'novelties' },
          { name: 'NAKSHI KANTHA TAPESTRIES', slug: 'nakshi-kantha-tapestries' },
          { name: 'T-SHIRTS', slug: 't-shirts' },
          { name: 'TRADITIONAL TOYS & DOLLS', slug: 'traditional-toys-dolls' },
          { name: 'BOOKS', slug: 'books' },
          { name: 'LAWN & GARDENING', slug: 'lawn-gardening' },
        ],
      },
      {
        sections: [
          {
            title: 'OCCASIONS',
            items: [
              { name: 'Anniversaries', slug: 'anniversaries' },
              { name: 'Baby Showers', slug: 'baby-showers' },
              { name: 'Bridal Showers', slug: 'bridal-showers' },
              { name: 'Farewells', slug: 'farewells' },
              { name: 'Wedding Gifts', slug: 'wedding-gifts' },
            ],
          },
          {
            title: 'GIFT IDEAS BY PRICE',
            items: [
              { name: 'Under BDT 1000', slug: 'under-1000' },
              { name: 'BDT 1001 – 3000', slug: '1001-3000' },
              { name: 'BDT 3001 – 5000', slug: '3001-5000' },
              { name: 'Above BDT 5000', slug: 'above-5000' },
            ],
          },
        ],
      },
      {
        title: 'TEXTILE CRAFTS',
        items: [
          { name: 'Block Printing', slug: 'block-printing' },
          { name: 'Embroidery', slug: 'embroidery' },
          { name: 'Jamdani', slug: 'jamdani' },
          { name: 'Katan', slug: 'katan' },
          { name: 'Nakshi Kantha', slug: 'nakshi-kantha' },
          { name: 'Screen Printing', slug: 'screen-printing' },
          { name: 'Tie-Dye', slug: 'tie-dye' },
          { name: 'Weaving', slug: 'weaving' },
        ],
      },
      {
        title: 'NON TEXTILE CRAFTS',
        items: [
          { name: 'Bamboo & Cane', slug: 'bamboo-cane' },
          { name: 'Candles', slug: 'candles' },
          { name: 'Rugs & Carpets', slug: 'rugs-carpets' },
          { name: 'Studio Ceramics', slug: 'ceramics' },
          { name: 'Jewellery', slug: 'craft-jewellery' },
          { name: 'Leather', slug: 'leather-crafts' },
          { name: 'Metal', slug: 'metal-crafts' },
          { name: 'Natural Fibres', slug: 'natural-fibres' },
          { name: 'Recycled Handmade Paper', slug: 'handmade-paper' },
          { name: 'Terracotta & Clay', slug: 'terracotta-clay' },
          { name: 'Toys & Traditional Dolls', slug: 'traditional-dolls' },
          { name: 'Wood', slug: 'wood-crafts' },
        ],
      },
    ],
  },
  {
    id: 'brands',
    name: 'BRANDS',
    slug: 'brands',
    href: '/brands',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'The House of Brands',
      subtitle: 'Empowering over 65,000 rural artisans and enterprise communities',
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      link: '/brands',
      badge: 'Social Enterprise',
    },
    columns: [
      {
        sections: [
          {
            title: 'HERSTORY ATELIER',
            items: [
              { name: 'New Arrivals', slug: 'herstory-new' },
              { name: 'Luxury Pret', slug: 'luxury-pret' },
              { name: 'Bridal Couture', slug: 'bridal-couture' },
              { name: 'Saree', slug: 'herstory-saree' },
              { name: 'Jewellery', slug: 'herstory-jewellery' },
              { name: 'Clutches', slug: 'herstory-clutches' },
            ],
          },
          {
            title: 'ECOBELA BOTANICALS',
            items: [
              { name: 'Face Care', slug: 'earth-face' },
              { name: 'Hair Care', slug: 'earth-hair' },
              { name: 'Bath & Body', slug: 'earth-bath' },
              { name: 'Men’s Grooming', slug: 'earth-men' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: 'ECOBELA ARTISAN DAIRY',
            items: [
              { name: 'Artisanal Ghee', slug: 'dairy-ghee' },
              { name: 'Pure Honey', slug: 'dairy-honey' },
              { name: 'Traditional Sweets', slug: 'dairy-sweets' },
              { name: 'Milk & Butter', slug: 'dairy-butter' },
            ],
          },
          {
            title: 'ECOBELA NATURAL HARVEST',
            items: [
              { name: 'Cold-Pressed Mustard Oil', slug: 'mustard-oil' },
              { name: 'Organic Spices', slug: 'organic-spices' },
              { name: 'Herbal Tea', slug: 'herbal-tea' },
              { name: 'Raw Cane Sugar', slug: 'cane-sugar' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: 'HERITAGE RETREATS',
            items: [
              { name: 'Rajendrapur Resort', slug: 'rajendrapur-resort' },
              { name: 'Savar Eco Retreat', slug: 'savar-resort' },
              { name: 'Conference & Retreats', slug: 'conference-retreats' },
            ],
          },
          {
            title: 'BENGAL BOTANIC NURSERY',
            items: [
              { name: 'Flowering Plants', slug: 'flowering-plants' },
              { name: 'Fruit Plants', slug: 'fruit-plants' },
              { name: 'Bonsai & Planters', slug: 'bonsai-planters' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: 'HANDMADE & RECYCLED PAPERS',
            items: [
              { name: 'Notebooks & Journals', slug: 'notebooks' },
              { name: 'Corporate Stationery', slug: 'stationery' },
              { name: 'Gift Bags', slug: 'gift-bags' },
              { name: 'Photo Frames', slug: 'photo-frames' },
            ],
          },
          {
            title: 'RAJSHAHI SILK ATELIER',
            items: [
              { name: 'Pure Rajshahi Silk', slug: 'brac-silk-sarees' },
              { name: 'Mulberry Silks', slug: 'mulberry-silk' },
              { name: 'Silk Scarves & Stoles', slug: 'silk-stoles' },
            ],
          },
          {
            title: 'ECOBELA HERITAGE CAFE',
            items: [
              { name: 'Artisanal Bakery', slug: 'bakery' },
              { name: 'Traditional Savouries', slug: 'savouries' },
              { name: 'Heritage Beverages', slug: 'beverages' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'wedding',
    name: 'WEDDING',
    slug: 'wedding',
    href: '/wedding',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'The Royal Wedding Atelier',
      subtitle: 'Heirloom bridal couture and groom ensembles for auspicious moments',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      link: '/wedding',
      badge: 'Haute Couture',
    },
    columns: [
      {
        title: 'Bridal Trousseau',
        items: [
          { name: 'Mirpur Katan Sarees', slug: 'bridal-katan' },
          { name: 'Benarasi Jamdani', slug: 'benarasi-jamdani' },
          { name: 'Bridal Lehengas', slug: 'bridal-lehengas' },
          { name: 'Handloom Dupattas', slug: 'handloom-dupattas' },
          { name: 'Velvet Shawls', slug: 'velvet-shawls' },
        ],
      },
      {
        title: "Groom's Atelier",
        items: [
          { name: 'Royal Sherwanis', slug: 'royal-sherwanis' },
          { name: 'Mulberry Silk Panjabi', slug: 'silk-panjabi' },
          { name: 'Koti & Waistcoats', slug: 'groom-koti' },
          { name: 'Pajama & Dhoti', slug: 'groom-pajama' },
          { name: 'Pagri & Nagra Shoes', slug: 'nagra-shoes' },
        ],
      },
      {
        title: 'Wedding Jewellery',
        items: [
          { name: 'Bridal Chokers', slug: 'bridal-chokers' },
          { name: 'Polki & Kundan', slug: 'polki-kundan' },
          { name: 'Matha Patti & Maang Tikka', slug: 'bridal-matha-patti' },
          { name: 'Haathphool & Rings', slug: 'bridal-haathphool' },
          { name: 'Nath & Jhumkas', slug: 'bridal-jhumkas' },
        ],
      },
      {
        title: 'Gifting & Décor',
        items: [
          { name: 'Trousseau Trays & Boxes', slug: 'trousseau-trays' },
          { name: 'Silver Plated Keepsakes', slug: 'silver-keepsakes' },
          { name: 'Brass Urlis & Bowls', slug: 'brass-urlis' },
          { name: 'Wedding Favors', slug: 'wedding-favors' },
        ],
      },
    ],
  },
  {
    id: 'festive-gift-ideas',
    name: 'FESTIVE GIFT IDEAS',
    slug: 'festive-gift-ideas',
    href: '/gifts-crafts/festive-gift-boxes',
    hasMegaMenu: true,
    featuredBanner: {
      title: 'Festive Offerings & Blessings',
      subtitle: 'Thoughtful celebratory gift boxes crafted for loved ones',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      link: '/gifts-crafts/festive-gift-boxes',
      badge: 'Festive Edition',
    },
    columns: [
      {
        title: 'Festive Hampers',
        items: [
          { name: 'Festive Deluxe Gift Box', slug: 'festive-deluxe-box' },
          { name: 'Artisanal Sweet Assortments', slug: 'artisanal-sweets' },
          { name: 'Dry Fruit & Nut Boxes', slug: 'dry-fruits-nuts' },
          { name: 'Decorative Diya & Candle Sets', slug: 'diya-gift-sets' },
        ],
      },
      {
        title: 'Festive Essentials',
        items: [
          { name: 'Pure Brass Serving Thalis', slug: 'brass-serving-thalis' },
          { name: 'Attar & Fragrance Vials', slug: 'attar-vials' },
          { name: 'Brass Ghonta & Shankha', slug: 'ghonta-shankha' },
          { name: 'Sandalwood Incense Sets', slug: 'incense-sets' },
        ],
      },
      {
        title: 'Gifts By Price',
        items: [
          { name: 'Under BDT 1000', slug: 'under-1000' },
          { name: 'BDT 1001 – 2500', slug: '1001-2500' },
          { name: 'BDT 2501 – 5000', slug: '2501-5000' },
          { name: 'Luxury Above 5000', slug: 'above-5000' },
        ],
      },
      {
        title: 'Atelier Gift Cards',
        items: [
          { name: 'BDT 1,000 Gift Voucher', slug: 'voucher-1000' },
          { name: 'BDT 2,500 Gift Voucher', slug: 'voucher-2500' },
          { name: 'BDT 5,000 Gift Voucher', slug: 'voucher-5000' },
          { name: 'BDT 10,000 Gift Voucher', slug: 'voucher-10000' },
        ],
      },
    ],
  },
  {
    id: 'eid-festive-26',
    name: 'EID & FESTIVE 26',
    slug: 'eid-festive-26',
    href: '/special-collections',
    hasMegaMenu: true,
    featuredBanner: {
      title: "Eid & Festive '26 Collection",
      subtitle: 'Celebrating togetherness, elegance, and Bengal heritage',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      link: '/special-collections',
      badge: 'Festive 2026',
    },
    columns: [
      {
        sections: [
          {
            title: 'FESTIVE GIFT IDEAS',
            items: [
              { name: 'Gift Hampers', slug: 'hampers' },
              { name: 'Sweets & Treats', slug: 'sweets' },
              { name: 'Brass Serving Thalis', slug: 'thalis' },
              { name: 'Attar Sets', slug: 'attar' },
            ],
          },
          {
            title: 'TAAGA',
            items: [
              { name: 'Contemporary Kurtas', slug: 'taaga-kurtas' },
              { name: 'Tunics & Tops', slug: 'taaga-tops' },
              { name: 'Fusion Sets', slug: 'taaga-fusion' },
            ],
          },
        ],
      },
      {
        title: 'WOMEN',
        items: [
          { name: 'Eid Special Sarees', slug: 'festive-sarees' },
          { name: 'Zari & Silk Sarees', slug: 'zari-silk-sarees' },
          { name: 'Dhakai Jamdani', slug: 'jamdani' },
          { name: 'Festive Kurtas', slug: 'festive-kurtas' },
          { name: 'Shalwar Kameez', slug: 'shalwar-kameez' },
        ],
      },
      {
        title: 'MEN',
        items: [
          { name: 'Festive Panjabi & Dhoti Sets', slug: 'festive-dhoti' },
          { name: 'Embroidered Silk Panjabi', slug: 'silk-panjabi' },
          { name: 'Short Khadi Kurta', slug: 'short-kurta' },
          { name: 'Festive Kotis', slug: 'festive-koti' },
        ],
      },
      {
        sections: [
          {
            title: "KIDS'",
            items: [
              { name: 'Girls’ Mini Sarees & Ghagras', slug: 'kids-sarees' },
              { name: 'Boys’ Festive Panjabis', slug: 'kids-panjabi' },
              { name: 'Infant Rompers', slug: 'infants' },
            ],
          },
          {
            title: 'HOME DÉCOR & JEWELLERY',
            items: [
              { name: 'Heritage Floor Mats', slug: 'heritage-mats' },
              { name: 'Temple Jewellery', slug: 'temple-jewellery' },
              { name: 'Terracotta Diyas', slug: 'diyas' },
              { name: 'Brass Lanterns', slug: 'lanterns' },
            ],
          },
        ],
      },
    ],
  },
];
