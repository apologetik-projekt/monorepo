import type { DetailedHTMLProps, StyleHTMLAttributes } from 'react'

export type CSSObject = React.CSSProperties & {
  [Key: string]: React.CSSProperties | CSSObject | string | number | undefined
}

interface StyleProps
  extends Omit<
    DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>,
    'children'
  > {
  children: CSSObject
}

export function Style({ children, ...props }: StyleProps) {
  const styles = createStyles(children)
  return <style {...props}>{styles}</style>
}

// Stolen from https://github.com/souporserious/restyle
const unitessCssStyles =
  /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/

function createStyles(styles: CSSObject) {
  function process(styles: CSSObject, selector = '', parentAtRule = '') {
    let declarations = ''
    let nestedCss = ''
    for (const key in styles) {
      const value = styles[key]
      if (value === undefined || value === null) {
        continue
      }
      if (typeof value === 'object') {
        const atRule = /^@/.test(key) ? key : undefined
        let nestedSelector = ''
        if (atRule) {
          nestedSelector = selector
        } else if (key.includes('&')) {
          nestedSelector = key.replace(/&/g, selector)
        } else if (key.startsWith(':') || key.startsWith('::')) {
          nestedSelector = selector + key
        } else if (selector) {
          nestedSelector = selector + ' ' + key
        } else {
          nestedSelector = key
        }
        const nestedResult = process(value as CSSObject, nestedSelector, atRule || parentAtRule)
        if (atRule) {
          nestedCss += `${key}{${nestedResult}}`
        } else {
          nestedCss += nestedResult
        }
        continue
      }
      // CSS property
      const hyphenProp = key.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
      let parsedValue
      if (key.startsWith('--') || unitessCssStyles.test(key)) {
        parsedValue = value
      } else {
        parsedValue = typeof value === 'number' ? value + 'px' : value
      }
      declarations += `${hyphenProp}:${parsedValue};`
    }
    let result = ''
    if (declarations) {
      result += `${selector}{${declarations}}`
    }
    result += nestedCss
    return result
  }
  return process(styles)
}
