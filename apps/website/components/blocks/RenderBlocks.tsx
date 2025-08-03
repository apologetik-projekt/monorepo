import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { FormBlock } from './Form'
import { ImageBlock } from './Media'
import type { Page } from '@repo/payload'
import {
	type SerializedEditorState,
	type SerializedRootNode,
} from '@payloadcms/richtext-lexical/lexical'

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
	...defaultConverters,
	blocks: {
		imageBlock: ImageBlock,
		formBlock: FormBlock,
	},
})

function isSerializedLexicalEditorState(data: unknown): data is SerializedEditorState {
	return (
		typeof data === 'object' &&
		data !== null &&
		'root' in data &&
		typeof (data as { root: unknown }).root === 'object' &&
		((data as { root: unknown })['root'] as SerializedRootNode).type === 'root'
	)
}

export function RenderBlocks({ content }: { content: Page['content'] }) {
	if (content && isSerializedLexicalEditorState(content)) {
		return <RichText data={content} converters={jsxConverters} />
	}
}
