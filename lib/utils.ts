import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDate(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

export function getThreatLevel(score: number): { level: string; color: string; className: string } {
  if (score >= 80) return { level: 'CRITICAL', color: '#e63946', className: 'threat-red' };
  if (score >= 60) return { level: 'HIGH', color: '#ff6b35', className: 'threat-orange' };
  if (score >= 40) return { level: 'ELEVATED', color: '#fbbf24', className: 'threat-yellow' };
  return { level: 'NORMAL', color: '#4a7c59', className: 'threat-green' };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
