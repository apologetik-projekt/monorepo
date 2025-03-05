import Link from 'next/link'
import type { Navigation } from '#/types/payload'
import { DynamicLink, Nav, NavigationItem } from './navigation.client'

interface NavigationProps {
  navigation: Navigation['navItems']
}

type CollectionItemReference = NonNullable<
  NonNullable<NonNullable<Navigation['navItems']>[number]['link']>['reference']
>['value']

export default function Navigation({ navigation }: NavigationProps) {
  function getCollectionItemSlug(item: CollectionItemReference | undefined) {
    if (typeof item == 'object' && 'slug' in item && typeof item.slug == 'string') {
      return item.slug
    }
    return item
  }

  function getNavLink(item: NonNullable<Navigation['navItems']>[number]) {
    if (getCollectionItemSlug(item.link?.reference?.value) == 'home') return '/'
    if (item.nestedNavItems && item.nestedNavItems.length > 0)
      return `/${item.nestedNavItems[0]?.link.url}`
    return item.link?.url ?? `/${getCollectionItemSlug(item.link?.reference?.value)}`
  }

  return (
    <Nav
      className={`group/nav w-full font-mono relative z-30 max-w-5xl mx-auto py-6 px-4 sm:px-5 md:pl-7 lg:px-0 select-none flex justify-between items-center data-[theme=dark]:text-gray-100 dark:group-data-supports-dark-mode/route:text-gray-100`}
    >
      <Link href="/" className="md:translate-y-1.5 ml-1 no-tap active:sepia">
        <picture>
          <img
            height={40.58}
            width={68}
            className="dark:group-data-supports-dark-mode/route:invert group-data-[theme=dark]/nav:invert"
            src="/logo.svg"
            alt="Apologetik Projekt - Logo"
          />
        </picture>
      </Link>
      <ul className="hidden md:flex space-x-2 leading-none items-start font-medium uppercase text-nav #text-gray-200">
        {navigation?.map((item) => (
          <li key={item.id} className="group relative leading-none no-tap">
            <NavigationItem prefetch href={getNavLink(item)} type={item.type ?? 'link'}>
              {item.type == 'group' ? item.label : item.link?.label}
            </NavigationItem>
            {item.type == 'group' && (
              <div
                className="hidden group-hover:block absolute top-4 left-0 normal-case text-gray-700 mt-0.5 whitespace-nowrap"
                style={{ filter: 'drop-shadow(0 -1px 4px rgb(10 10 6 / 8%))' }}
              >
                <div className="h-2 w-2 absolute top-3 left-3 bg-white shadow-xs transform rotate-45 z-0"></div>
                <ul className="p-0.5 z-10 relative bg-white font-sans text-gray-800 rounded-[1px] mt-4 active:pointer-events-auto">
                  {item.nestedNavItems?.map((subitem) => (
                    <li key={subitem.id}>
                      <DynamicLink
                        href={`/${subitem.link.url ?? getCollectionItemSlug(subitem.link.reference?.value)}`}
                        className="px-3 block py-2 hover:bg-yellow-900/20 saturate-[20%] rounded-[1px]"
                        activeClassName="text-stroke-100 text-black hover:text-black!"
                      >
                        {subitem.link.label}&nbsp;
                      </DynamicLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Nav>
  )
}
