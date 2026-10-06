export interface SubCategoryItem {
  name: string;
  slug: string;
  items?: { name: string; slug: string }[];
}

export interface MegaMenuColumnSection {
  title: string;
  items: {
    name: string;
    slug: string;
    subItems?: { name: string; slug: string }[];
  }[];
}

export interface MegaMenuColumn {
  title?: string;
  items?: {
    name: string;
    slug: string;
    subItems?: { name: string; slug: string }[];
  }[];
  sections?: MegaMenuColumnSection[];
}

export interface MegaMenuBanner {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  badge?: string;
}

export interface NavCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  hasMegaMenu?: boolean;
  columns?: MegaMenuColumn[];
  featuredBanner?: MegaMenuBanner;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  subcategories: string[];
}
