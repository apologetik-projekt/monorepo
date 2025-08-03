'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { usePathname, useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { Style } from './styles'
import clsx from 'clsx'

const fallbackImage =
	'data:image/png;base64,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'

export function AdminBar() {
	const router = useRouter()
	const path = usePathname()
	const [user, setUser] = useState<any>(null)
	const [state, action, pending] = useActionState(async (previousState: any) => {
		const searchParams = new URLSearchParams({ path })
		const url =
			previousState == 'draft'
				? '/next/exit-preview'
				: `/next/preview?slug=home&collection=pages&path=%2Fhome`
		const response = await fetch(url)
		if (response.ok) {
			router.refresh()
			return previousState == 'draft' ? 'live' : 'draft'
		}
		return previousState
	}, 'draft')
	useEffect(() => {
		fetch(`${getClientSideURL()}/api/users/me`)
			.then((r) => r.json())
			.then((r) => {
				setUser(r.user)
			})
	}, [])

	if ((typeof window !== 'undefined' && window.self !== window.top) || !user) return null
	return (
		<div className="bg-neutral-900 select-none rounded-xs text-sm text-white ring-2 ring-neutral-50/10 gap-1 fixed bottom-4 left-4 z-10 flex items-center shadow-sm">
			<div className="p-2 flex items-center">
				<div className="rounded-full bg-gray-300 size-5 p-0.25 mr-2 overflow-hidden">
					<picture>
						<img
							src={user?.profilePicture?.sizes.thumbnail.url ?? fallbackImage}
							className="rounded-full"
							width={18}
							height={18}
							alt="Profilbild"
						/>
					</picture>
				</div>
				{user !== null && 'firstName' in user ? user.firstName : 'Unbekannter Nutzer'}
			</div>
			{pending && <Style>{{ html: { cursor: 'wait' } }}</Style>}
			<form action={action} className={clsx({ 'opacity-75': pending })}>
				{state === 'live' ? (
					<button
						className="bg-blue-500 px-3 leading-[36px] cursor-pointer"
						title="Livemodus beenden"
						disabled={pending}
					>
						Öffentliche Version
					</button>
				) : (
					<button
						className="bg-emerald-500 px-3 leading-[36px] cursor-pointer"
						title="Entwurfsmodus beenden"
						disabled={pending}
					>
						Aktuellster Entwurf
					</button>
				)}
			</form>
		</div>
	)
}

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

export const PayloadAdminBar: React.FC<PayloadAdminBarProps> = (props) => {
	const {
		id: docID,
		adminPath = '/admin',
		apiPath = '/api',
		authCollectionSlug = 'users',
		className,
		classNames,
		cmsURL = 'http://localhost:3000',
		collectionLabels,
		collectionSlug,
		createProps,
		devMode,
		divProps,
		editProps,
		logo,
		logoProps,
		logoutProps,
		onAuthChange,
		onPreviewExit,
		preview,
		previewProps,
		style,
		unstyled,
		userProps,
	} = props

	const [user, setUser] = useState<PayloadMeUser>()

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const meRequest = await fetch(`${cmsURL}${apiPath}/${authCollectionSlug}/me`, {
					credentials: 'include',
					method: 'get',
				})
				const meResponse = await meRequest.json()
				const { user } = meResponse

				if (user) {
					setUser(user)
				} else {
					setUser(null)
				}
			} catch (err) {
				console.warn(err)
				setUser(null)
			}
		}

		void fetchMe()
	}, [cmsURL, adminPath, apiPath])

	useEffect(() => {
		if (typeof onAuthChange === 'function') {
			onAuthChange(user)
		}
	}, [user, onAuthChange])

	if (user) {
		const { id: userID, email } = user

		return (
			<div
				className={className}
				id="payload-admin-bar"
				style={{
					...(unstyled !== true
						? {
								alignItems: 'center',
								backgroundColor: '#222',
								boxSizing: 'border-box',
								color: '#fff',
								display: 'flex',
								fontFamily:
									'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
								fontSize: 'small',
								left: 0,
								minWidth: '0',
								padding: '0.5rem',
								position: 'fixed',
								top: 0,
								width: '100%',
								zIndex: 99999,
							}
						: {}),
					...style,
				}}
			>
				<a
					className={classNames?.logo}
					href={`${cmsURL}${adminPath}`}
					{...logoProps}
					style={{
						...(unstyled !== true
							? {
									alignItems: 'center',
									color: 'inherit',
									display: 'flex',
									flexShrink: 0,
									height: '20px',
									marginRight: '10px',
									textDecoration: 'none',
									...(logoProps?.style
										? {
												...logoProps.style,
											}
										: {}),
								}
							: {}),
					}}
				>
					{logo || 'Payload CMS'}
				</a>
				<a
					className={classNames?.user}
					href={`${cmsURL}${adminPath}/collections/${authCollectionSlug}/${userID}`}
					rel="noopener noreferrer"
					target="_blank"
					{...userProps}
					style={{
						...(unstyled !== true
							? {
									color: 'inherit',
									display: 'block',
									marginRight: '10px',
									minWidth: '50px',
									overflow: 'hidden',
									textDecoration: 'none',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									...(userProps?.style
										? {
												...userProps.style,
											}
										: {}),
								}
							: {}),
					}}
				>
					<span
						style={{
							...(unstyled !== true
								? {
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}
								: {}),
						}}
					>
						{email || 'Profil'}
					</span>
				</a>
				<div
					className={classNames?.controls}
					{...divProps}
					style={{
						...(unstyled !== true
							? {
									alignItems: 'center',
									display: 'flex',
									flexGrow: 1,
									flexShrink: 1,
									justifyContent: 'flex-end',
									marginRight: '10px',
									...(divProps?.style
										? {
												...divProps.style,
											}
										: {}),
								}
							: {}),
					}}
				>
					{collectionSlug && docID && (
						<a
							className={classNames?.edit}
							href={`${cmsURL}${adminPath}/collections/${collectionSlug}/${docID}`}
							rel="noopener noreferrer"
							target="_blank"
							{...editProps}
							style={{
								display: 'block',
								...(unstyled !== true
									? {
											color: 'inherit',
											flexShrink: 1,
											marginRight: '10px',
											overflow: 'hidden',
											textDecoration: 'none',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											...(editProps?.style
												? {
														...editProps.style,
													}
												: {}),
										}
									: {}),
							}}
						>
							<span
								style={{
									...(unstyled !== true
										? {
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}
										: {}),
								}}
							>
								{`${collectionLabels?.singular || 'Seite'} bearbeiten`}
							</span>
						</a>
					)}
					{collectionSlug && (
						<a
							className={classNames?.create}
							href={`${cmsURL}${adminPath}/collections/${collectionSlug}/create`}
							rel="noopener noreferrer"
							target="_blank"
							{...createProps}
							style={{
								...(unstyled !== true
									? {
											color: 'inherit',
											display: 'block',
											flexShrink: 1,
											overflow: 'hidden',
											textDecoration: 'none',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											...(createProps?.style
												? {
														...createProps.style,
													}
												: {}),
										}
									: {}),
							}}
						>
							<span
								style={{
									...(unstyled !== true
										? {
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}
										: {}),
								}}
							>
								{`Neue ${collectionLabels?.singular || 'Seite'}`}
							</span>
						</a>
					)}
					{preview && (
						<button
							className={classNames?.preview}
							onClick={onPreviewExit}
							{...previewProps}
							style={{
								...(unstyled !== true
									? {
											background: 'none',
											border: 'none',
											color: 'inherit',
											cursor: 'pointer',
											fontFamily: 'inherit',
											fontSize: 'inherit',
											marginLeft: '10px',
											padding: 0,
											...(previewProps?.style
												? {
														...previewProps.style,
													}
												: {}),
										}
									: {}),
							}}
							type="button"
						>
							Exit preview mode
						</button>
					)}
				</div>
				<a
					className={classNames?.logout}
					href={`${cmsURL}${adminPath}/logout`}
					rel="noopener noreferrer"
					target="_blank"
					{...logoutProps}
					style={{
						...(unstyled !== true
							? {
									color: 'inherit',
									display: 'block',
									flexShrink: 1,
									overflow: 'hidden',
									textDecoration: 'none',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									...(logoutProps?.style
										? {
												...logoutProps.style,
											}
										: {}),
								}
							: {}),
					}}
				>
					<span
						style={{
							...(unstyled !== true
								? {
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}
								: {}),
						}}
					>
						Logout
					</span>
				</a>
			</div>
		)
	}

	return null
}
