/** Eco Bela storefront taxonomy. Insert only this taxonomy — never products. */
export type TaxonomyNode = { name: string; children?: TaxonomyNode[] };

export const womenTaxonomy: TaxonomyNode[] = [
  { name: "NEW ARRIVALS" },
  {
    name: "SAREE",
    children: ["Cotton", "Muslin", "Silk", "Katan", "Nakshi Kantha", "Jamdani", "Brac Silk"]
      .map((name) => ({ name })),
  },
  {
    name: "SHALWAR KAMEEZ",
    children: ["Cotton & Blends", "Silk", "Muslin"].map((name) => ({ name })),
  },
  { name: "KURTA" }, { name: "PANJABI" }, { name: "TOPS" }, { name: "COATS & JACKETS" },
  { name: "SHRUGS" }, { name: "SKIRTS" }, { name: "PANTS" },
  {
    name: "MATERNITY",
    children: ["Tops", "Tunics", "Dresses", "Pants", "Sleepwears"].map((name) => ({ name })),
  },
  { name: "DUPATTA" }, { name: "SCARVES" }, { name: "NIGHTWEAR" },
  {
    name: "SHAWLS",
    children: ["Viscose", "Cotton", "Silk", "Endi", "Nakshi Kantha"].map((name) => ({ name })),
  },
  {
    name: "SHOES",
    children: ["Sandals", "Heels", "Pumps", "Nagras"].map((name) => ({ name })),
  },
  {
    name: "ACCESSORIES",
    children: ["Bags", "Purses", "Wallets", "Card Holders", "Key Rings"].map((name) => ({ name })),
  },
  { name: "TAAGA" }, { name: "HERSTORY BY AARONG" },
];
