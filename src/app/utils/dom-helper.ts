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
