import { Inter, Space_Grotesk } from 'next/font/google'

// Side effectful assignment. Importing this module will load css.
export const inter = Inter({ subsets: ['latin-ext'], preload: true })
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin-ext'] })

export function importFonts() {
  // This export exists solely to:
  // 1. Prevent unused import warnings in layout.tsx
  // 2. Make the side-effect of font loading explicit
  void 0
}
