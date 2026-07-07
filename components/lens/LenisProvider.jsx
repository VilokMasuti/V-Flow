// app/components/LenisProvider.jsx
"use client";
import { ReactLenis } from "lenis/react";
export function LenisProvider({ children }) {
  return (
    <ReactLenis
      root // Applies smooth scroll to the entire page
      options={{
        lerp: 0.08, // Linear interpolation intensity (smoothness)
        duration: 1.2, // Duration in seconds (only if lerp is not defined)
        smoothWheel: true, // Enables smooth scrolling for mouse wheel events
        smoothTouch: false, // Enables smooth scrolling for touch events
        wheelMultiplier: 1, // Multiplier for wheel scroll

        autoResize: true, // Automatically resize on window changes
        syncTouch: false, // Sync touch with scroll
      }}
    >
      {children}
    </ReactLenis>
  );
}
