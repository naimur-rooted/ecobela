import type { TaxonomyNode } from "./women";

const leaves = (names: string[]) => names.map((name) => ({ name }));

export const homeDecorTaxonomy: TaxonomyNode[] = [
  {
    name: "LIVING",
    children: leaves(["Bedcovers", "Kantha & Quilt", "Cushion Covers", "Curtains", "Pillow Covers", "Sofa Throw", "Table Covers & Sofa Backs", "Rugs & Carpets"]),
  },
  {
    name: "DINING",
    children: leaves(["Plates & Platters", "Bowls", "Cutlery & Utensils", "Trays", "Tablecloths", "Runners", "Placemats & Napkins", "Napkin Holders", "Coasters"]),
  },
  {
    name: "DÉCOR",
    children: leaves(["Wall Hangings", "Brass Novelties", "Cast Iron Novelties", "Vases", "Lanterns & Candle Stands", "Wooden Accents", "Boxes"]),
  },
  { name: "KIDS HOME" },
  {
    name: "STATIONERY & GIFT CARDS",
    children: leaves(["Books", "Notebooks", "Desk Accessories", "Recycled Paper Products"]),
  },
];

export const giftsCraftsTaxonomy: TaxonomyNode[] = [
  { name: "EARTH GIFT BASKETS" },
  { name: "SOUVENIRS", children: leaves(["Novelties", "Nakshi Kantha Tapestries", "T-Shirts", "Traditional Toys & Dolls"]) },
  { name: "BOOKS" },
  { name: "OCCASIONS", children: leaves(["Anniversaries", "Baby Showers", "Bridal Showers", "Farewells", "Wedding Gifts"]) },
  {
    name: "TEXTILE CRAFTS",
    children: leaves(["Block Printing", "Embroidery", "Jamdani", "Katan", "Nakshi Kantha", "Screen Printing", "Tie-Dye", "Weaving"]),
  },
  {
    name: "NON TEXTILE CRAFTS",
    children: leaves(["Bamboo & Cane", "Rugs & Carpets", "Jewellery", "Leather", "Metal", "Natural Fibres", "Recycled Handmade Paper", "Wood"]),
  },
];
