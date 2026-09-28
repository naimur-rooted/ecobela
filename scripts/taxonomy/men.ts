import type { TaxonomyNode } from "./women";

export const menTaxonomy: TaxonomyNode[] = [
  { name: "NEW ARRIVALS" },
  {
    name: "PANJABI",
    children: ["Cotton & Blends", "Addi", "Endi", "Silk", "Muslin & Jamdani", "Taaga Man Panjabis"]
      .map((name) => ({ name })),
  },
  {
    name: "PANJABI PAJAMA SETS",
    children: ["Cotton & Blends", "Silk"].map((name) => ({ name })),
  },
  { name: "PAJAMA" }, { name: "COATY" }, { name: "SHORT KURTA" }, { name: "JACKETS" },
  {
    name: "TROUSERS", children: ["Chinos", "Denim", "Lounge Wear"].map((name) => ({ name })),
  },
  { name: "SHIRTS", children: ["Ethnic", "Casual", "Executive"].map((name) => ({ name })) },
  {
    name: "FATUA", children: ["Cotton & Blends", "Endi", "Silk"].map((name) => ({ name })),
  },
  { name: "LUNGI" }, { name: "SHAWLS" }, { name: "SCARVES & MUFFLERS" }, { name: "T-SHIRTS" },
  { name: "SLEEPING SUITS" },
  { name: "SHOES", children: ["Sandals", "Nagras"].map((name) => ({ name })) },
  {
    name: "ACCESSORIES",
    children: ["Belts", "Wallets", "Card Holders", "Key Rings", "Bags"].map((name) => ({ name })),
  },
  { name: "TUPI" }, { name: "TAAGA MAN" },
];
