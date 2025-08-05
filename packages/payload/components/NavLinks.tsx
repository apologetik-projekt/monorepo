import type { ServerProps, SanitizedPermissions } from 'payload'
import { NavLink } from './NavLinks.client'
import { EntityType } from '@payloadcms/ui/shared'
import type { EntityToGroup, NavGroupType } from '@payloadcms/ui/shared'
import type { I18nClient, TFunction } from '@payloadcms/translations'

// Reverse of @payloadcms/ui/shared#groupNavItems
function findUngroupedNavItems(
	entities: EntityToGroup[],
	permissions: SanitizedPermissions,
	i18n: I18nClient
) {
	const result = entities.reduce(
		(navItems, entityToGroup) => {
			const entityType = entityToGroup.type.toLowerCase() as 'collections' | 'globals'
			if (
				entityToGroup.entity?.admin?.group === false &&
				permissions[entityType]?.[entityToGroup.entity.slug]?.read
			) {
				const labelOrFunction =
					'labels' in entityToGroup.entity
						? entityToGroup.entity.labels.plural
						: entityToGroup.entity.label
				const label =
					typeof labelOrFunction === 'function'
						? labelOrFunction({ i18n: i18n, t: i18n.t as TFunction })
						: labelOrFunction
				navItems.push({
					slug: entityToGroup.entity.slug,
					type: entityToGroup.type,
					label: label,
				})
			}
			return navItems
		},
		[] as NavGroupType['entities']
	)
	return result
}

export default function NavLinks({ permissions, payload, i18n }: ServerProps) {
	const navItems = findUngroupedNavItems(
		[
			...payload.config.collections.map(
				(collection) =>
					({
						type: EntityType.collection,
						entity: collection,
					}) satisfies EntityToGroup
			),
			...payload.config.globals.map(
				(global) =>
					({
						type: EntityType.global,
						entity: global,
					}) satisfies EntityToGroup
			),
		],
		permissions ?? {},
		i18n
	)

	const favorites = ['pages', 'navigation', 'media', 'redirects', 'forms', 'form-submissions']
	navItems.sort((a, b) => {
		const indexA = favorites.indexOf(a.slug)
		const indexB = favorites.indexOf(b.slug)
		if (indexA !== -1 || indexB !== -1) {
			if (indexA === -1) return 1
			if (indexB === -1) return -1
			return indexA - indexB
		}
		return a.slug.localeCompare(b.slug)
	})

	function getPermission(
		type: NavGroupType['entities'][0]['type'],
		slug: NavGroupType['entities'][0]['slug']
	) {
		if (type === 'collections' && permissions?.collections) {
			return permissions.collections[slug]?.read
		}
		if (type === 'globals' && permissions?.globals) {
			return permissions?.globals[slug]?.read
		}
		return permissions ? [type] : false
	}

	return (
		<div style={{ marginBottom: 10 }}>
			<NavLink id="dashbaord" href="/admin">
				Dashboard
			</NavLink>
			<div style={{ height: 9 }}></div>
			{navItems.map(
				(item) =>
					getPermission(item.type, item.slug) && (
						<NavLink
							key={item.slug}
							id={item.slug}
							href={
								item.slug == 'media'
									? '/admin/collections/media/payload-folders'
									: `/admin/${item.type}/${item.slug}`
							}
						>
							{typeof item.label == 'string' ? item.label : item.label.plural}
						</NavLink>
					)
			)}
		</div>
	)
}
