"use client";
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import type { Viewport } from 'next'

import { importMap } from './importMap.js'
import './custom.scss'

type Args = {
	children: React.ReactNode
}

export const viewport: Viewport = {
	userScalable: false,
}

const queryClient = new QueryClient();

const serverFunction: ServerFunctionClient = async function (args) {
	'use server'
	return handleServerFunctions({
		...args,
		config,
		importMap,
	})
}

const Layout = ({ children }: Args) => (
	<RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	</RootLayout>
)

export default Layout
