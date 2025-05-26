'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { XYChart, AnimatedAxis, AnimatedGrid, AreaSeries, Tooltip } from '@visx/xychart'
import { Button, SelectInput, ShimmerEffect } from '@payloadcms/ui'
import Link from 'next/link'

interface DataPoint {
	x: Date
	y: number
}
const getX = (d: DataPoint) => d.x
const getY = (d: DataPoint) => d.y

const getXAxisTickFormat = (date: Date, range: string): string => {
	if (!(date instanceof Date) || isNaN(date.getTime())) return String(date)
	if (range === 'today') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	if (range === 'week') return date.toLocaleDateString([], { weekday: 'short' })
	return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const fetchAnalyticsData = async (timeRange: string): Promise<DataPoint[]> => {
	const plausibleApiKey = process.env.PLAUSIBLE_API_KEY || process.env.NEXT_PUBLIC_PLAUSIBLE_API_KEY

	if (!plausibleApiKey) {
		throw new Error('PLAUSIBLE_API_KEY is not configured. Please set the environment variable.')
	}

	let queryBody: any = {
		site_id: 'import.apologetik-projekt.de',
		metrics: ['visitors'],
		include: { time_labels: true, imports: true },
	}

	if (timeRange === 'today') {
		queryBody.date_range = 'day'
		queryBody.dimensions = ['time:hour']
	} else if (timeRange === 'week') {
		queryBody.date_range = '7d'
		queryBody.dimensions = ['time:day']
	} else {
		queryBody.date_range = '30d'
		queryBody.dimensions = ['time:day']
	}

	const response = await fetch('https://sherlock.apologetik-projekt.de/api/v2/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${plausibleApiKey}`,
		},
		body: JSON.stringify(queryBody),
	})

	if (!response.ok) {
		if (response.status === 401 || response.status === 403) {
			throw new Error('Authentication failed. Check your API key or permissions.')
		}
		throw new Error('Failed to load data from Plausible API.')
	}

	const plausibleData = await response.json()
	let transformedData: DataPoint[] = []
	if (plausibleData.meta?.time_labels && plausibleData.results) {
		transformedData = plausibleData.meta.time_labels.map((label: string) => {
			const resultEntry = plausibleData.results.find((r: any) => r.dimensions[0] === label)
			return {
				x: new Date(label),
				y: resultEntry ? resultEntry.metrics[0] : 0,
			}
		})
	} else if (plausibleData.results) {
		transformedData = plausibleData.results.map((item: any) => ({
			x: new Date(item.dimensions[0]),
			y: item.metrics[0],
		}))
	}

	return transformedData.sort((a, b) => a.x.getTime() - b.x.getTime())
}

const AnalyticsChart: React.FC = () => {
	const [timeRange, setTimeRange] = useState<string>('month')

	const {
		data: chartData,
		isLoading,
		isError,
		isRefetching,
		error,
	} = useQuery<DataPoint[], Error>({
		queryKey: ['analyticsData', timeRange],
		queryFn: () => fetchAnalyticsData(timeRange),
		staleTime: 5 * 60 * 1000,
		placeholderData: (prev) => prev,
	})

	const cardStyle: React.CSSProperties = {
		// padding: '16px',
		// border: '1px solid var(--theme-elevation-100)',
		// borderRadius: '3px',
	}

	const [chartWidth, setChartWidth] = useState<number>(0)
	const chartRef = useRef<HTMLDivElement>(null)
	useLayoutEffect(() => {
		if (chartRef.current) {
			setChartWidth(chartRef.current.clientWidth)
		}
	}, [chartRef?.current?.clientWidth])

	return (
		<div style={cardStyle}>
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h3>Aufrufe</h3>
					<div style={{ display: 'flex', gap: 12 }}>
						<Link
							href="https://sherlock.apologetik-projekt.de/apologetik-projekt.de"
							target="_blank"
						>
							<Button
								buttonStyle="subtle"
								size="large"
								icon={
									<svg
										height={15}
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										style={{ transform: 'translateY(-1px)' }}
									>
										<path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V12L17.206 8.207L11.2071 14.2071L9.79289 12.7929L15.792 6.793L12 3H21Z"></path>
									</svg>
								}
							>
								Vollständige Statistiken ansehen
							</Button>
						</Link>

						<SelectInput
							name="range"
							path="statistics"
							value={timeRange}
							onChange={(option) => {
								if ('value' in option) setTimeRange(String(option.value))
							}}
							hasMany={false}
							isClearable={false}
							style={{ minWidth: 145, maxHeight: 40 }}
							options={[
								{
									label: 'Heute',
									value: 'today',
								},
								{
									label: 'Letzte 7 Tage',
									value: 'week',
								},
								{
									label: 'Letzte 30 Tage',
									value: 'month',
								},
							]}
						/>
					</div>
				</div>
				<div ref={chartRef} style={{ height: 300, overflow: 'hidden', width: '100%' }}>
					{(isLoading || isRefetching) && (
						<div style={{ marginTop: 26 }}>
							<ShimmerEffect animationDelay="40" height={260} />
						</div>
					)}
					{isError && (
						<p style={{ color: 'red' }}>
							Fehler: {error?.message || 'Ein unbekannter Fehler ist aufgetreten'}
						</p>
					)}

					{!isLoading && !isError && (!chartData || chartData.length === 0) && (
						<p>Keine Daten für den ausgewählten Zeitraum verfügbar.</p>
					)}

					{!(isLoading || isRefetching) && !isError && chartData && chartData.length > 0 && (
						<XYChart
							height={300}
							width={chartWidth}
							xScale={{ type: 'time' }}
							yScale={{ type: 'linear' }}
							margin={{ top: 10, right: 0, bottom: 30, left: 30 }}
						>
							<AnimatedGrid columns={false} numTicks={5} lineStyle={{ stroke: '#aaaaaa60' }} />
							<AnimatedAxis orientation="left" numTicks={5} stroke="#aaaaaa60" />
							<AnimatedAxis
								orientation="bottom"
								numTicks={timeRange === 'today' ? 6 : timeRange === 'week' ? 7 : 10}
								strokeWidth={0}
								tickFormat={(d) => getXAxisTickFormat(d as Date, timeRange)}
							/>

							<>
								<AreaSeries
									dataKey="area-1"
									data={chartData}
									xAccessor={getX}
									yAccessor={getY}
									fillOpacity={0.1}
									fill="#3040ff"
									lineProps={{ stroke: '#3040ff', strokeWidth: 2 }}
								/>
								<Tooltip
									snapTooltipToDatumX
									snapTooltipToDatumY
									showVerticalCrosshair
									showSeriesGlyphs
									verticalCrosshairStyle={{ stroke: '#8888bb', strokeWidth: 1 }}
									style={{
										position: 'absolute',
										pointerEvents: 'none',
										background: '#fefefeb4',
										backdropFilter: 'blur(4px)',
										border: '1px solid var(--theme-elevation-100)',
										borderRadius: '1px',
										padding: 8,
										top: -4,
									}}
									renderTooltip={({ tooltipData }) => (
										<div>
											{tooltipData?.nearestDatum?.datum && (
												<>
													<div>
														<strong>Zeit:</strong>{' '}
														{getXAxisTickFormat(
															getX(tooltipData.nearestDatum.datum as DataPoint),
															timeRange,
														)}
													</div>
													<div>
														<strong>Aufrufe:</strong>{' '}
														{getY(tooltipData.nearestDatum.datum as DataPoint)}
													</div>
												</>
											)}
											{!tooltipData?.nearestDatum?.datum && <div>Über einen Punkt fahren</div>}
										</div>
									)}
								/>
							</>
						</XYChart>
					)}
				</div>
			</div>
		</div>
	)
}

export default AnalyticsChart
