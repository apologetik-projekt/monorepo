'use client'
import { type Navigation } from '#/types/payload'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Navigation['navItems']>[number]>()

  const label = data?.data?.label
    ? data.data.label
    : data?.data?.link?.label
      ? `${data?.data?.link?.label}`
      : `Navigationseintrag ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}`

  return <div>{label}</div>
}
