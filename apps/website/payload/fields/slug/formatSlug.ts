export const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/ä/g, 'ae')
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ß/g, 'ss')
    .replace(/[^\w-]+/g, '')
