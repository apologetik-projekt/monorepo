/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@repo/payload/config'
import '@payloadcms/next/css'
import './custom.scss'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { importMap } from '@repo/payload/importMap.js'

import type { PropsWithChildren } from 'react'
import type { ServerFunctionClient } from 'payload'
import type { Viewport } from 'next'

export const viewport: Viewport = {
	userScalable: false,
}

const serverFunction: ServerFunctionClient = async function (args) {
	'use server'
	return handleServerFunctions({
		...args,
		config,
		importMap,
	})
}

const Layout = ({ children }: PropsWithChildren) => (
	<RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
		{children}
	</RootLayout>
)

export default Layout
