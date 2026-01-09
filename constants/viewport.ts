/**
 * Standardized Viewport Configuration
 * 
 * This file centralizes viewport settings to ensure consistency
 * across all tests and prevent viewport-related issues.
 * 
 * IMPORTANT: Viewport size accounts for browser chrome (address bar, tabs, etc.)
 * to prevent content from being cut off. The viewport represents the actual
 * content area, not the full screen size.
 * 
 * Using 1280x720 as the standard viewport size:
 * - Accounts for browser chrome (~200px for address bar, tabs, bookmarks)
 * - Prevents content from being cut off at the bottom
 * - Reliable and well-tested
 * - Ensures all UI elements are visible
 */

export const STANDARD_VIEWPORT = {
  width: 1280,
  height: 720,
} as const;

export const VIEWPORT_CONFIG = {
  /**
   * Standard desktop viewport (Full HD)
   * Recommended for most automation scenarios
   */
  DESKTOP: STANDARD_VIEWPORT,
  
  /**
   * Large desktop viewport (2K)
   * Use if you need more screen space
   */
  LARGE_DESKTOP: {
    width: 2560,
    height: 1440,
  },
  
  /**
   * Standard laptop viewport
   */
  LAPTOP: {
    width: 1366,
    height: 768,
  },
} as const;

/**
 * Get the standard viewport size
 * @returns Standard viewport dimensions
 */
export function getStandardViewport() {
  return STANDARD_VIEWPORT;
}
