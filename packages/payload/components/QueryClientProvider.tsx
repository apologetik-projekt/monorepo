'use client'
import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider as QCP } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function QueryClientProvider({ children }: PropsWithChildren) {
	return <QCP client={queryClient}>{children}</QCP>
}
