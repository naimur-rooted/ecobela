import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`
}

export function calculateDiscount(currentPrice: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= currentPrice) return null
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
