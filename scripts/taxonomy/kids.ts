import type { TaxonomyNode } from "./women";

const leaves = (names: string[]) => names.map((name) => ({ name }));

export const kidsTaxonomy: TaxonomyNode[] = [
  { name: "KIDS NEW ARRIVALS" },
  {
    name: "JUNIOR GIRLS (2Y-9Y)",
    children: leaves(["Frocks", "Skirt Tops", "Pant Tops", "T-Shirts", "Shalwar Kameez", "Ghagra Choli", "Saree", "Sweaters & Jackets", "Pants"]),
  },
  {
    name: "JUNIOR BOYS (2Y-7Y)",
    children: leaves(["Shirts", "Fatua", "T-Shirts & Polos", "Shirt Pant Sets", "Pants", "Panjabi", "Panjabi Pajama Sets", "Pajama", "Tupi", "Waistcoats & Hoodies"]),
  },
  {
    name: "GIRLS (8Y-15Y)",
    children: leaves(["Frocks", "Tops", "Skirts", "Pants", "Shalwar Kameez", "Ghagra Choli"]),
  },
  {
    name: "BOYS (8Y-15Y)",
    children: leaves(["Shirts", "Fatua", "T-Shirts & Polos", "Shirt Pant Sets", "Pants", "Panjabi", "Pajama", "Panjabi Pajama Sets", "Waistcoats & Hoodies", "Sleeping Suits", "Belts"]),
  },
  {
    name: "NEWBORN GIRLS (0-1.5Y)",
    children: leaves(["Nima", "Frocks", "Skirt Tops", "Pant Tops", "Shalwar Kameez"]),
  },
  {
    name: "NEWBORN BOYS (0-1.5Y)",
    children: leaves(["Nima", "Shirt Pant Sets", "Panjabi", "Panjabi Pajama Sets", "Pajama"]),
  },
  {
    name: "SHOES",
    children: leaves(["Newborn (0.3Y-1.5Y)", "Toddler (1Y-3Y)", "Junior Girls (4Y-6Y)", "Junior Boys (4Y-6Y)", "Girls (7Y-14Y)", "Boys (7Y-14Y)"]),
  },
  {
    name: "TOYS & BOOKS",
    children: leaves(["Learning & Education", "Stuffed & Plush Toys", "Wooden Toys", "Traditional Toys & Dolls"]),
  },
];
