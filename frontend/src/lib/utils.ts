/**
 * Utility function to concatenate class names
 * Filters out falsy values and joins with spaces
 *
 * @param classes - Array of class names (strings, undefined, null, or false)
 * @returns Concatenated string of valid class names
 *
 * @example
 * cn('btn', 'btn--primary', someCondition && 'btn--active', className)
 * // => "btn btn--primary btn--active custom-class"
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
