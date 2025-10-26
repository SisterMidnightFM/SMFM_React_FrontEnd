/**
 * Schedule type definitions
 */

import type { StrapiTimestamps } from './strapi';
import type { ShowReference } from './show';

// Show slot component within a schedule
export interface ShowSlot {
  id: number;
  Show_Name?: ShowReference;
  Start_Time: string; // Time format: HH:mm:ss.SSS
  End_Time: string; // Time format: HH:mm:ss.SSS
}

// Schedule entry
export interface Schedule extends StrapiTimestamps {
  id: number;
  Date: string; // Date format: YYYY-MM-DD
  Show_Slots?: ShowSlot[];
}
