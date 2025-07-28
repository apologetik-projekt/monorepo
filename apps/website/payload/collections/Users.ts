import { authenticated } from '#/payload/access/authenticated'
import { isAdmin } from '#/payload/access/isAdmin'
import { generateExpiredPayloadCookie, type CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
	slug: 'users',
	labels: {
		singular: 'Benutzerkonto',
		plural: 'Benutzerkonten',
	},
	admin: {
		group: 'Einstellungen',
		defaultColumns: ['fullName', 'email'],
		useAsTitle: 'fullName',
	},
	auth: {
		loginWithUsername: {
			allowEmailLogin: true,
			requireEmail: true,
		},
	},
	access: {
		admin: authenticated,
		create: isAdmin,
		delete: ({ req, id }) => id == req.user?.id || isAdmin({ req }),
		read: ({ req, id }) => id == req.user?.id || isAdmin({ req }),
		update: ({ req, id }) => id == req.user?.id || isAdmin({ req }),
	},
	fields: [
		{
			name: 'profilePicture',
			label: 'Profilbild',
			type: 'upload',
			relationTo: 'media',
			displayPreview: true,
			filterOptions: {
				mimeType: { contains: 'image' },
			},
			admin: {
				isSortable: false,
			},
		},
		{
			type: 'row',
			fields: [
				{
					name: 'firstName',
					label: 'Vorname',
					type: 'text',
					required: true,
				},
				{
					name: 'lastName',
					label: 'Nachname',
					type: 'text',
				},
			],
		},
		{
			name: 'fullName',
			label: 'Name',
			type: 'text',
			admin: {
				readOnly: true,
				hidden: true,
			},
			hooks: {
				beforeChange: [
					({ siblingData }) => {
						let fullName = siblingData.firstName
						if (siblingData.lastName) {
							fullName += ` ${siblingData.lastName}`
						}
						return fullName
					},
				],
			},
		},
		{
			name: 'role',
			type: 'select',
			required: true,
			options: [
				{ label: 'Superadmin', value: 'superadmin' },
				{ label: 'Admin', value: 'admin' },
				{ label: 'Editor', value: 'editor' },
				{ label: 'Autor', value: 'author' },
			],
		},
	],
	timestamps: true,
	hooks: {
		afterLogout: [
			({ req, collection }) => {
				// Bugfix for logout issue on azure static web app
				let expiredCookie = generateExpiredPayloadCookie({
					collectionAuthConfig: collection.auth,
					config: req.payload.config,
					cookiePrefix: req.payload.config.cookiePrefix,
				})

				expiredCookie = expiredCookie.replace(/Expires=[^;]+/i, 'Max-Age=0')

				req.responseHeaders = req.responseHeaders ?? new Headers()
				req.responseHeaders.set('Set-Cookie', expiredCookie)

				return req
			},
		],
	},
}
