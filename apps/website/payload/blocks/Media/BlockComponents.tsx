'use client'

import type { StaticImageData } from 'next/image'
import cn from 'clsx'

import NextImage from 'next/image'
import React from 'react'

const breakpoints = {
	'3xl': 1920,
	'2xl': 1536,
	xl: 1280,
	lg: 1024,
	md: 768,
	sm: 640,
}

import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '#/types/payload'

export interface MediaProps {
	alt?: string
	className?: string
	fill?: boolean // for NextImage only
	htmlElement?: ElementType | null
	imgClassName?: string
	onClick?: () => void
	onLoad?: () => void
	loading?: 'lazy' | 'eager' // for NextImage only
	priority?: boolean // for NextImage only
	ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
	resource?: MediaType | string | number // for Payload media
	size?: string // for NextImage only
	src?: StaticImageData // for static media
	videoClassName?: string
	layoutWidth?: '25%' | '50%' | '75%' | '100%'
	alignment?: 'left' | 'right' | 'center'
	float?: boolean
}

import { getClientSideURL } from '#/payload/utilities/getURL'

// A base64 encoded image to use as a placeholder while the image is loading
const placeholderBlur =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAASwaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjUuMCI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICB0aWZmOkltYWdlTGVuZ3RoPSIzMiIKICAgdGlmZjpJbWFnZVdpZHRoPSIzMiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIvMSIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjMyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMzIiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIKICAgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wM1QyMzowOTo0NyswMTowMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wM1QyMzowOTo0NyswMTowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InByb2R1Y2VkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBQaG90byAxLjEwLjgiCiAgICAgIHN0RXZ0OndoZW49IjIwMjUtMDMtMDNUMjM6MDk6NDcrMDE6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0iciI/Pg+J67cAAAJzUExURf/YsdXFu/rbtsm+u5SXpZydqr65tvXXsP7UvMTL1OPdzLKus//WudvWw7i0tczDu+nNut3Xv83Qyquqr/3/6t3Zy//bsaSkrdvU0fvow/nWwunVsdTS0v/ZtsO7t/v30e3fvvzm2YqPoK2ssMXHx//cscfMzv7bvfriu//jufHPvevkzNLO1P7+1djIxP3czP///9vT072/vNDKvevTsf/vy/z/3tbUyenZuf3+2vPivfjWttzJvf/txc3OzcvKxcvN0/z/3f3/48zMzvPqzO/duPXw0NHMxP/l1I2Rou/VsejUs+zkyOLaxNLX3PXnxOfVuf/ZxP/mvf/ds+3j2dvb2OvbvOTa08zJx/nm9v/y2+jXtcfAueDVzP/80/PlxP/61sfP2f/pxMPDvs7Jv9vNwv/du/7yzf/evM3Jv8rNzP/as/XlxP/dxO3RyvXZy+Ha5P/hy//kzODTy//v/vzc0v//+/Xj8fjg4f/2+b7BvvHVsamnsP/ivsHCvdLKvtHNzcLDwu7fvv/duf3uy//1zcrIv8S9uf/eu9fS1dXPyv/ux//ryOHPwuTRxMbGvsTEv//dtP/auvLduv/etf/Zy//cx//cv+3TxP/dwf/fxe3Ztf/izujUyNHLvv/iw9rQx//pyP/ny/Xb0Pjm6J+grOLKuuvbudHMwf/50dfNwvrmw//5076/vNXLv9PNwdfOw9fKv9TT2MHCvv/wyf/atf/gt/v20//yyfPVs//mwv/huP/fv+HSyPXXs//iwf/i0v/fzMvJwu/cu+vYtf/czf/gxPPXyP/lwcfHx/z10f/x0//x0NXT1+Ha4P/44f/f0ZBIOwkAAAAJcEhZcwAACxMAAAsTAQCanBgAAANfSURBVDjLLdD3QxNnGMDxJ3eQu+x4SeCyEzIJGYhAIEKAIEkAERBlD4sMQYZAQdDaWvfem6GCo9XW0brt3kvbP6nPe+S9H5/PfZ/3DrTawm0FPbaijtra/L3mgX2nDhdrc3NzP2zb9VWl89M9eSCAEQQNxtoa88F9vYOrYPcuv9u5J08A3aSwxmjMrwHzsd7BQGxmZoYALBAQq+guqD/QYTTey2fAvKO3YFuhNneubfe745XOr7/Mg1is4ouChwfu12KBgDen/irWzs21zb43tf55bvvHECss/vyQPlJlNNYwAHDsj9v/tLf/23Zndivf2noWQWFFwErA3hqGQTHg1S//3d5+xz7bwidaj5zbDhXFAetJvZcSxgDUNzdvL8ftdvtKy60TiZ9UZ1Mg28tkgAB2fH9zctKe/G+6ZSqY6BtSQSBgPVyqz35xficD2Hh+wXt9ZGJienplcepWsG/oCASs1melmze/pTJIggFq4OpvN0KhX3+f+jb4+LN166Dban2FhexLLqEA1EGP4XrjlcvXFvufPPgEwUvrYKkeQRPlEhqw/oLHgOfM6f7gIwLi8Xg9rvC6XC4mg0TkcpZtZH1nSvqf9qlUKohvKK3Xe72ksJpYb2ZZ1qc+XSISqQjYgKcn4s2mmoQCApJQq4V5Z2cn5ORsrI9EIhcvUU0kwCAgAZzTR49axBYCNtpstqqLFPkTuEAOLKjVIhVNWyxisZgAaZ3N1lxV9R21EygABD41vo9jpVKmBKlUWietW9NcVFQ0T1Fmsxyv8FoAOHfIHATgnJyGX+YpOSXHO6jzRbRYrJQ5HA4NATqFTqFQoGj42ePx4EfiFXG7zKHRZGaCVIdHkVAsLSFpNng8BlKg6dT8LnTpdOFwmEtEFUNYafZcNeBXltBkgSYzPT0dWvguPsxx0bKyMtxjGx0dbWTVIgLIPC0deJ4PmziOK0MSVUhHrtwwsD4EMo0G52lpwHeZwvujw+5hJyqddPzHiVDjKshMAd5kipYPu51uN8eZdDk/hEKGsRTAeTWsXWvy7690S8jDbdJtSU6GLvuCFqXsIxLIyhJAZblE4pRIJB9s2rolmVwYvxakCcD3qxGYTvhxLhwC7PaF0BgpkCtUk4L/uL+8XAikQHJ8jKYJIBuy/gfYnte83u/bJAAAAABJRU5ErkJggg=='

export const ImageResource: React.FC<MediaProps> = (props) => {
	const {
		alt: altFromProps,
		fill,
		imgClassName,
		priority,
		resource,
		size: sizeFromProps,
		src: srcFromProps,
		loading: loadingFromProps,
		layoutWidth = '100%',
		alignment = 'left',
		float = false,
	} = props

	let width: number | undefined
	let height: number | undefined
	let alt = altFromProps
	let src: StaticImageData | string = srcFromProps || ''

	if (!src && resource && typeof resource === 'object') {
		const {
			alt: altFromResource,
			//filename: fullFilename,
			height: fullHeight,
			url,
			width: fullWidth,
		} = resource

		width = fullWidth!
		height = fullHeight!
		alt = altFromResource || ''

		src = `${getClientSideURL()}${url}`
	}

	const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

	// NOTE: this is used by the browser to determine which image to download at different screen sizes
	const sizes = sizeFromProps
		? sizeFromProps
		: Object.entries(breakpoints)
				.map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
				.join(', ')

	return (
		<picture>
			<NextImage
				alt={alt || ''}
				className={cn(imgClassName, {
					'w-1/4': layoutWidth === '25%',
					'w-1/2': layoutWidth === '50%',
					'w-2/3': layoutWidth === '75%',
					'w-full': layoutWidth === '100%',
					'float-left': float && alignment == 'left',
					'float-right': float && alignment == 'right',
					'block ml-auto': !float && alignment == 'right',
					'mx-auto': !float && alignment == 'center',
				})}
				fill={fill}
				height={!fill ? height : undefined}
				placeholder="blur"
				blurDataURL={placeholderBlur}
				priority={priority}
				quality={100}
				loading={loading}
				sizes={sizes}
				src={src}
				width={!fill ? width : undefined}
			/>
		</picture>
	)
}
