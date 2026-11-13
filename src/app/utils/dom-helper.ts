/**
 * Checks if the currently active element (focused) is inside the given container.
 * If it is, it removes the focus (blurs) from that element.
 * Useful to prevent focus jumps when the container structure changes drastically.
 *
 * @param container The container element to check within.
 */
export function blurActiveElementInside(container: HTMLElement): void {
  const activeElement = document.activeElement as HTMLElement | null;

  if (activeElement && container.contains(activeElement)) {
    activeElement.blur();
  }
}

/**
 * Checks if the given element is focusable.
 * An element is considered focusable if it is visible (has client rects), is not disabled, and is not hidden via CSS.
 *
 * @param el The element to check.
 * @returns True if the element is focusable, false otherwise.
 */
export function isFocusableElement(el: HTMLElement): boolean {
  if (el.matches(':disabled') || el.closest('[inert]')) {
    return false;
  }

  if (el.getClientRects().length === 0) {
    return false;
  }

  return getComputedStyle(el).visibility !== 'hidden';
}

/**
 * Queries all focusable elements within the given root element that match the specified selector.
 *
 * @param root The root element to query within.
 * @param selector The CSS selector to match focusable elements.
 * @returns An array of focusable elements matching the selector within the root element.
 */
export function queryFocusableElements<T extends HTMLElement = HTMLElement>(root: HTMLElement, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector)).filter(isFocusableElement);
}
