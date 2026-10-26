/**
 * Monitor screen dimensions in world units. The lock screen is laid out at
 * 960×600 CSS px and mapped onto this plane (16:10).
 */
export const SCREEN = { width: 3.2, height: 2.0, y: 0.06, z: 0.136, px: { w: 960, h: 600 } } as const;

/** Fraction of the viewport width the screen should occupy in the idle view */
export const IDLE_SCREEN_FRACTION = 0.56;
