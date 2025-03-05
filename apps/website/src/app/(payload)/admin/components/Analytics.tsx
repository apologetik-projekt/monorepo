'use client'
import IframeResizer from 'iframe-resizer-react'
export function Analytics({ theme }: { theme: string }) {
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  const params = new URLSearchParams({
    auth: '95SBh4UgwhGFivboujz0N',
    embed: 'true',
    theme: theme,
    background: theme == 'light' ? 'transparent' : '#141414',
  })
  const url = `https://anna.apologetik-projekt.de/share/apologetik-projekt.de?${params.toString()}`

  return (
    <IframeResizer
      plausible-embed="true"
      src={url}
      frameBorder={0}
      loading="lazy"
      style={{ width: '1px', minWidth: '100%', minHeight: 650 }}
      checkOrigin={false}
      heightCalculationMethod="taggedElement"
      onInit={(iframe) => {
        iframe.iFrameResizer.sendMessage({
          type: 'load-custom-styles',
          opts: {
            styles: '.items-start { display: none; }',
          },
        })
      }}
    />
  )
}
