/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to merge class names together safely
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
