function codeIsInRanges(number: number, arrayOfRanges: number[][]) {
  return arrayOfRanges.some(
    ([lowerBound, upperBound]) => Number(lowerBound) <= number && number <= Number(upperBound),
  )
}

function isCJK(c?: string): boolean {
  if (typeof c !== 'string') {
    return false
  }
  const charCode = c.charCodeAt(0)
  return codeIsInRanges(charCode, [
    [0x3040, 0x309f],
    [0x4e00, 0x9fff],
    [0xac00, 0xd7a3],
    [0x20000, 0x2ebe0],
  ])
}

function isAnsiWordBound(c?: string): boolean {
  if (typeof c !== 'string') return false
  return ' \n\r\t'.includes(c)
}

function isPunctuation(c?: string): boolean {
  if (typeof c !== 'string') {
    return false
  }
  const charCode = c.charCodeAt(0)
  return codeIsInRanges(charCode, [
    [0x21, 0x2f],
    [0x3a, 0x40],
    [0x5b, 0x60],
    [0x7b, 0x7e],
    [0x3000, 0x303f],
    [0xff00, 0xffef],
  ])
}

export function readingTime(text: string) {
  let words = 0,
    start = 0,
    end = text.length - 1

  // use provided value if available
  const wordsPerMinute = 200

  while (isAnsiWordBound(text[start])) start++
  while (isAnsiWordBound(text[end])) end--

  const normalizedText = `${text}\n`

  for (let i = start; i <= end; i++) {
    if (
      isCJK(normalizedText[i]) ||
      (!isAnsiWordBound(normalizedText[i]) &&
        (isAnsiWordBound(normalizedText[i + 1]) || isCJK(normalizedText[i + 1])))
    ) {
      words++
    }
    if (isCJK(normalizedText[i])) {
      while (
        i <= end &&
        (isPunctuation(normalizedText[i + 1]) || isAnsiWordBound(normalizedText[i + 1]))
      ) {
        i++
      }
    }
  }

  // reading time stats
  const minutes = words / wordsPerMinute
  // Math.round used to resolve floating point funkyness
  //   http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
  const time = Math.round(minutes * 60 * 1000)
  const displayed = Math.ceil(Number(minutes.toFixed(2)))

  return {
    text: displayed + ' min read',
    minutes: minutes,
    time: time,
    words: words,
  }
}
