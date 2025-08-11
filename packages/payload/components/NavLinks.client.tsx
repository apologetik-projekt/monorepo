'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'

export function NavLink({
	href,
	id,
	children,
}: React.PropsWithChildren<{ href: string; id: string }>) {
	const pathname = usePathname()
	return (
		<Link
			className={'nav__link' + (pathname === href ? ' active' : '')}
			id={'#nav-' + id}
			href={href}
		>
			{pathname === href ? <div className="nav__link-indicator"></div> : null}
			<span className="nav__link-label">{children}</span>
		</Link>
	)
}
