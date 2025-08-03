import clsx from 'clsx'
import { ImageResource } from '../image-resource'
import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'

export const ImageBlock = ({ node: { fields } }: { node: SerializedBlockNode }) => {
	const float = fields.float == 'true'
	if (fields.image == null) return null
	return (
		<ImageResource
			imgClassName={clsx({
				'mr-4 pr-1': float && fields.alignment == 'left',
				'ml-4 pl-1': float && fields.alignment == 'right',
			})}
			resource={{ ...fields.image }}
			layoutWidth={fields.size}
			alignment={fields.alignment}
			float={float}
		/>
	)
}
