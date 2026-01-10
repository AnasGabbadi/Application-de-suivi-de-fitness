import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour combiner des classes CSS conditionnellement
 * et fusionner intelligemment les classes Tailwind
 * 
 * @param {...(string|string[]|Object)} inputs - Classes CSS à combiner
 * @returns {string} Classes CSS combinées et fusionnées
 * 
 * @example
 * cn('px-2 py-1', 'text-sm') // => 'px-2 py-1 text-sm'
 * cn('px-2', { 'py-1': true, 'py-2': false }) // => 'px-2 py-1'
 * cn('px-2 py-1', 'px-4') // => 'px-4 py-1' (fusion intelligente)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;