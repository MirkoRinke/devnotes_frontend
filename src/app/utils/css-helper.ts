/**
 * Helper to get the bounding rectangle position (top, bottom, left, right) of an element.
 *
 * @param element The HTML element.
 * @param side The side position you want ('top', 'bottom', 'left', 'right').
 * @returns The position in pixels relative to the viewport.
 */
export function getElementPositionFrom(element: HTMLElement, side: 'top' | 'bottom' | 'left' | 'right'): number {
  return element.getBoundingClientRect()[side];
}

/**
 * Helper to get the size (width or height) of an element using its bounding rectangle.
 *
 * @param element
 * @param dimension
 * @returns The size of the element in pixels.
 */
export function getElementSizeFrom(element: HTMLElement, dimension: 'width' | 'height'): number {
  return element.getBoundingClientRect()[dimension];
}

/**
 * Helper to extract and parse a CSS variable value from a computed style object.
 */
export function getCssVariableValue(style: CSSStyleDeclaration, variableName: string): number {
  return parseCssValue(style.getPropertyValue(variableName).trim());
}

/**
 * Parses a CSS value string (e.g., "100px", "2rem") and converts it to a number of pixels.
 *
 * @param value The CSS value string to parse.
 * @returns The numeric value in pixels.
 */
export function parseCssValue(value: string): number {
  if (!value) return 0;

  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  if (value.endsWith('rem')) {
    return parseFloat(value) * rootFontSize;
  }

  return parseFloat(value);
}

/**
 * Helper to get the height of an element by its ID. Returns 0 if the element is not found.
 *
 * @param id The ID of the element.
 * @returns The height of the element in pixels, or 0 if not found.
 */
export function getHeightById(id: string): number {
  const element = document.getElementById(id);
  return element ? element.offsetHeight : 0;
}

/**
 * Helper to get the width of an element by its ID. Returns 0 if the element is not found.
 *
 * @param id The ID of the element.
 * @returns The width of the element in pixels, or 0 if not found.
 */
export function getWidthById(id: string): number {
  const element = document.getElementById(id);
  return element ? element.offsetWidth : 0;
}
