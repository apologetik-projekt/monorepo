'use client'

import { registerMasonry } from 'masonry-pf'

export function Masonry({
  children,
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className="grid grid-rows-[masonry] grid-cols-1 md:grid-cols-2 md:gap-x-4 lg:gap-x-14"
      ref={registerMasonry}
    >
      {children}
    </div>
  )
}
