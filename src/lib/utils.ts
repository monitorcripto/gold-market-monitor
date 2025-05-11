
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  // Format numbers less than 1 with more precision
  if (value < 1) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 8
    }).format(value);
  }
  
  // Format large numbers with fewer decimal places
  if (value >= 1000000) {
    if (value >= 1000000000) {
      // Billions: show as 1.23B
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    // Millions: show as 1.23M
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  
  // Regular formatting for medium-sized numbers
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
