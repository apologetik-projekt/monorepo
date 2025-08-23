'use client'

import { startTransition, useActionState, useState } from 'react'
import {
	Globe,
	PenTool,
	X,
	Edit3,
	LogOut,
	ChevronRight,
	Upload,
	LayoutDashboard,
} from 'lucide-react'
import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Mode = 'draft' | 'live'

interface PayloadUser {
	id: string
	email: string
	fullName?: string
	avatar?: string
	roles?: string[]
}

interface AdminBarProps {
	payloadUrl: string
	collection: string
	documentId: string | number
	authToken?: string
	onClose?: () => void
	onError?: (error: string) => void
	initialMode: Mode
	showCloseButton?: boolean
}

function usePayloadDocument(
	payloadUrl: string,
	authToken: string | undefined,
	collection: string,
	documentId: string | number
) {
	const swrConfig = {
		fetcher: (url: string) =>
			fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					...(authToken && { Authorization: `JWT ${authToken}` }),
				},
			}).then((res) => {
				if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`)
				return res.json()
			}),
		revalidateOnFocus: true,
		errorRetryCount: 2,
	}

	const {
		data: document,
		error: documentError,
		isLoading: documentLoading,
	} = useSWR(`${payloadUrl}/api/${collection}/${documentId}`, swrConfig.fetcher, swrConfig)

	const {
		data: draftDocument,
		error: draftError,
		isLoading: draftLoading,
	} = useSWR(`${payloadUrl}/api/${collection}/${documentId}?draft=true`, swrConfig.fetcher, {
		...swrConfig,
		onError: (error) => {
			if (!error.message.includes('404')) {
				console.error('Draft fetch error:', error)
			}
		},
	})

	const {
		data: user,
		error: userError,
		isLoading: userLoading,
	} = useSWR(`${payloadUrl}/api/users/me`, swrConfig.fetcher, swrConfig)

	const { trigger: publishDocument, isMutating: isPublishing } = useSWRMutation(
		`${payloadUrl}/api/${collection}/${documentId}`,
		(url: string) =>
			fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					...(authToken && { Authorization: `JWT ${authToken}` }),
				},
				body: JSON.stringify({ _status: 'published' }),
			}).then((res) => {
				if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`)
				return res.json()
			}),
		{
			onSuccess: (data) => {
				mutate(`${payloadUrl}/api/${collection}/${documentId}`, data, false)
				mutate(`${payloadUrl}/api/${collection}/${documentId}?draft=true`)
			},
		}
	)

	const { trigger: logout, isMutating: isLoggingOut } = useSWRMutation(
		`${payloadUrl}/api/users/logout`,
		(url: string) =>
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(authToken && { Authorization: `JWT ${authToken}` }),
				},
			}).then((res) => {
				if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`)
				return null
			}),
		{
			onSuccess: () => {
				mutate(`${payloadUrl}/api/users/me`, null, false)
				window.location.href = `${payloadUrl}/admin/login`
			},
		}
	)

	return {
		document,
		draftDocument,
		user,
		loading: documentLoading || draftLoading || userLoading,
		mutating: isPublishing || isLoggingOut,
		error: documentError || draftError || userError,
		publishDocument,
		logout,
		editUrl: `${payloadUrl}/admin/collections/${collection}/${documentId}`,
		dashboardUrl: `${payloadUrl}/admin`,
	}
}

function useAdminBarState(initialMode: Mode) {
	const [isVisible, setIsVisible] = useState(true)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const router = useRouter()
	const [mode, toggleMode, _pending] = useActionState<Mode>(async (previousState: any) => {
		const url =
			previousState == 'draft'
				? '/api/preview/exit'
				: `/api/preview?slug=home&collection=pages&path=%2Fhome`
		const response = await fetch(url)
		if (response.ok) {
			router.refresh()
			return previousState == 'draft' ? 'live' : 'draft'
		}
		return previousState
	}, initialMode)

	const handleExpand = () => setIsCollapsed(false)

	const handleClose = () => {
		if (isCollapsed) {
			setIsVisible(false)
		} else {
			setIsCollapsed(true)
		}
	}

	return {
		mode,
		isVisible,
		isCollapsed,
		toggleMode,
		handleExpand,
		handleClose,
		setIsVisible,
	}
}

function ToggleSwitch({
	checked,
	onChange,
	disabled,
}: {
	checked: boolean
	onChange: (checked: boolean) => void
	disabled?: boolean
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => !disabled && startTransition(() => onChange(!checked))}
			className={clsx(
				'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
				'disabled:cursor-not-allowed disabled:opacity-50',
				checked ? 'bg-green-500' : 'bg-amber-500'
			)}
		>
			<span className="sr-only">Toggle mode</span>
			<span
				aria-hidden="true"
				className={clsx(
					'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
					checked ? 'translate-x-5' : 'translate-x-0'
				)}
			/>
		</button>
	)
}

function Avatar({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
	const [imageError, setImageError] = useState(false)

	return (
		<div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
			{src && !imageError ? (
				<img
					src={src || '/placeholder.svg'}
					alt={alt}
					className="w-full h-full object-cover"
					onError={() => setImageError(true)}
				/>
			) : (
				<span className="text-xs font-medium text-gray-600">{fallback}</span>
			)}
		</div>
	)
}

function ModePill({
	type,
	isActive,
	isAvailable,
	label,
	className,
}: {
	type: 'draft' | 'live'
	isActive: boolean
	isAvailable: boolean
	label?: string
	className?: string
}) {
	const Icon = type === 'draft' ? PenTool : Globe
	const displayLabel = label || (type === 'draft' ? 'Vorschau' : 'Veröffentlicht')

	return (
		<div
			className={clsx(
				'flex items-center gap-2 px-3 py-1.5 rounded-xs transition-all duration-200 select-none',
				{
					'bg-amber-200/95 text-amber-900': isActive && isAvailable && type === 'draft',
					'bg-green-200/95 text-green-900': isActive && isAvailable && type === 'live',
					'text-gray-800 bg-gray-100': isAvailable && !isActive,
					'bg-gray-100 text-gray-500': !isAvailable,
				},
				className
			)}
		>
			<Icon className="w-4 h-4" />
			<span className="text-sm font-medium">{displayLabel}</span>
		</div>
	)
}

function ActionButton({
	icon: Icon,
	label,
	onClick,
	href,
	variant = 'neutral',
	disabled = false,
}: {
	icon: any
	label: string
	onClick?: () => void
	href?: string
	variant?: 'success' | 'neutral'
	disabled?: boolean
}) {
	const styles = clsx(
		'inline-flex items-center gap-1.5 h-8 px-3 rounded-xs text-sm font-medium transition-colors',
		'focus-visible:outline-slate-950',
		'disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer',
		{
			'text-green-800 hover:text-green-800 hover:bg-green-100': variant === 'success' && !disabled,
			'text-gray-800 hover:text-gray-800 hover:bg-gray-100': variant === 'neutral' && !disabled,
		}
	)

	if (href && !disabled) {
		return (
			<Link href={href} className={styles} target="_blank" rel="noopener noreferrer">
				<Icon className="w-4 h-4" />
				<span>{label}</span>
			</Link>
		)
	}

	return (
		<form onSubmit={onClick}>
			<button type="submit" disabled={disabled} className={styles}>
				<Icon className="w-4 h-4" />
				<span>{label}</span>
			</button>
		</form>
	)
}

function UserMenu({
	user,
	logoutAction,
	dashboardUrl,
}: {
	user: PayloadUser
	logoutAction: () => void
	dashboardUrl: string
}) {
	const initials = user.fullName
		? user.fullName
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
		: user.email.substring(0, 2).toUpperCase()

	return (
		<div className="relative group">
			<div className="flex items-center gap-2 px-2 py-1 group-hover:bg-gray-100 rounded-xs cursor-default no-select">
				<Avatar src={user.avatar} alt={user.fullName || user.email} fallback={initials} />
				<span className="text-sm font-medium text-gray-800 text-nowrap">
					{user.fullName || user.email}
				</span>
			</div>

			<div className="absolute left-0 bottom-full mb-1 w-40 bg-white border border-gray-200 rounded-xs shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
				<div className="py-1">
					<a
						href={dashboardUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
					>
						<LayoutDashboard className="size-4 -translate-x-px" />
						Dashboard
					</a>
					<form onSubmit={logoutAction}>
						<button
							type="submit"
							className="w-full hover:cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
						>
							<LogOut className="size-4 -translate-x-px" />
							Abmelden
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default function AdminBar({
	payloadUrl,
	collection,
	documentId,
	authToken,
	onError,
	initialMode,
}: AdminBarProps) {
	const {
		document,
		draftDocument,
		user,
		loading,
		mutating,
		error,
		publishDocument,
		logout,
		editUrl,
		dashboardUrl,
	} = usePayloadDocument(payloadUrl, authToken, collection, documentId)

	const { mode, isVisible, isCollapsed, toggleMode, handleExpand, handleClose, setIsVisible } =
		useAdminBarState(initialMode)

	const handleCloseClick = () => {
		handleClose()
		if (isCollapsed) {
			setIsVisible(false)
		}
	}

	const handlePublish = async () => {
		try {
			await publishDocument()
			toggleMode()
		} catch (err) {
			onError?.('Failed to publish document')
		}
	}

	const handleLogout = async () => {
		try {
			await logout()
		} catch (err) {
			onError?.('Failed to logout')
		}
	}

	if (error && onError) {
		onError(error.message)
	}

	if (!isVisible || loading) return null

	const hasDraft = !!draftDocument
	const hasLive = !!document && document._status === 'published'
	const showToggle = hasLive
	const canPublish = hasDraft && !hasLive

	if (!user.user) return null

	return (
		<div
			className={clsx(
				'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-md border rounded-px transition-all duration-250',
				{
					'bg-white border-black/8 shadow-lg shadow-gray-400/10': !isCollapsed,
					'bg-amber-200/95 border-amber-200 text-amber-800 shadow-lg shadow-amber-500/10':
						isCollapsed && mode === 'draft',
					'bg-green-200/95 border-green-200 text-green-800 shadow-lg shadow-green-500/10':
						isCollapsed && mode === 'live',
				}
			)}
		>
			<div
				className={clsx(
					'flex items-center justify-between transition-all duration-200',
					isCollapsed ? 'p-1' : 'p-2'
				)}
			>
				<div className="flex items-center gap-2.5">
					{isCollapsed ? (
						<div className="-ml-1 -mr-2.5">
							<ModePill
								className="bg-transparent"
								type={mode}
								isActive={true}
								isAvailable={true}
								label={mode === 'draft' ? 'Vorschau-Modus' : 'Live-Modus'}
							/>
						</div>
					) : (
						<div className="flex items-center gap-3">
							{!showToggle ? (
								<ModePill
									type="draft"
									isActive={true}
									isAvailable={hasDraft}
									label={hasDraft ? 'Vorschau' : 'Aktuell'}
								/>
							) : (
								<>
									<ModePill
										type="draft"
										isActive={mode === 'draft'}
										isAvailable={hasDraft}
										label="Vorschau"
									/>
									<ToggleSwitch
										checked={mode === 'live'}
										onChange={toggleMode}
										disabled={mutating}
									/>
									<ModePill
										type="live"
										isActive={mode === 'live'}
										isAvailable={hasLive}
										label="Öffentlich"
									/>
								</>
							)}
						</div>
					)}
				</div>

				{!isCollapsed && (
					<div className="flex items-center mx-1">
						{canPublish && (
							<ActionButton
								icon={Upload}
								label="Veröffentlichen"
								onClick={handlePublish}
								variant="success"
								disabled={mutating}
							/>
						)}

						<ActionButton icon={Edit3} label="Bearbeiten" href={editUrl} />

						{user && (
							<UserMenu user={user.user} logoutAction={handleLogout} dashboardUrl={dashboardUrl} />
						)}
					</div>
				)}

				<button
					type="button"
					onClick={isCollapsed ? handleExpand : handleCloseClick}
					className={clsx(
						'inline-flex items-center justify-center hover:cursor-pointer size-8 rounded-xs transition-colors',
						'outline-slate-950',
						{
							'text-gray-600 hover:text-gray-800 hover:bg-gray-100': !isCollapsed,
							'text-amber-700 hover:text-amber-800 hover:bg-amber-500/20':
								isCollapsed && mode === 'draft',
							'text-green-700 hover:text-green-800 hover:bg-green-500/20':
								isCollapsed && mode === 'live',
						}
					)}
				>
					{isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
				</button>
			</div>
		</div>
	)
}
