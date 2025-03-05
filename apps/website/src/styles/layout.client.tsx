'use client'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

const routesThatSupportDarkMode = ['/blog']

interface BodyProps extends React.HTMLAttributes<HTMLBodyElement> {
  initialPath?: string
}
export function Body({ ...props }: BodyProps) {
  const pathname = usePathname()
  const supportsDarkMode = routesThatSupportDarkMode.some((route) => pathname.startsWith(route))
  const children = useMemo(() => props.children, [props.children])
  return (
    <body data-supports-dark-mode={supportsDarkMode ? '' : undefined} {...props}>
      {children}
    </body>
  )
}
