'use client'
import type { LinkProps } from 'next/link'
import { NavLink } from './mobile-nav'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const pagesWithDarkHero = ['/']

export type NavigationItemProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    type?: 'link' | 'group'
  }

export function NavigationItem({ children, className, type, ...props }: NavigationItemProps) {
  return (
    <NavLink {...props} className={type == 'group' ? 'active:pointer-events-none' : undefined}>
      {({ isActive }) => (
        <span
          className={clsx(
            'px-3 py-2 rounded-xs whitespace-nowrap hover:bg-gray-500/20 hover:transition-colors hover:duration-100',
            {
              'bg-gray-500/25 group-data-[theme=dark]/nav:!bg-gray-600/10': isActive,
              'group-hover:outline-2 group-hover:!bg-gray-400/5 outline-offset-[-2px] outline-gray-200/50 group-data-[theme=dark]/nav:outline-gray-700/30 dark:group-data-supports-dark-mode/route:outline-transparent':
                type == 'group',
            },
            type == 'group' ? 'hover:cursor-default' : 'hover:cursor-pointer',
            className,
          )}
        >
          {children}
        </span>
      )}
    </NavLink>
  )
}

type NavigationSubItemLink = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    activeClassName?: string
  }

// Because cant use render props in server components
export function DynamicLink({
  className,
  activeClassName,
  children,
  ...props
}: NavigationSubItemLink) {
  return (
    <NavLink className={({ isActive }) => clsx(className, isActive && activeClassName)} {...props}>
      {children}
    </NavLink>
  )
}

export function Nav(props: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const theme = pagesWithDarkHero.includes(pathname) ? 'dark' : 'light'
  return <nav {...props} data-theme={theme} />
}
