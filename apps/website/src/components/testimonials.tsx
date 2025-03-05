import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

type Quote = any

export default function Testimonials({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="flex flex-col justify-center items-center space-y-10 md:space-y-0 md:space-x-6 bg-[#FFEF31] md:flex-row px-5 pt-12 md:p-8 mt-12 -mx-5 md:-mx-9">
      <Quotes quotes={quotes} />
      <Socials />
    </div>
  )
}

function Quotes({ quotes }: { quotes: Quote[] }) {
  const reversedQuotes = structuredClone(quotes).reverse() as Quote[]
  const [items, setItems] = useState(reversedQuotes)

  function handleClick() {
    setItems((items) => items.slice(1).concat(items[0]))
  }
  return (
    <section className="relative">
      <div className="grid stack w-80" style={{ paddingTop: items.length * 7 - 9 }}>
        <AnimatePresence mode="popLayout">
          {items.slice(0, 5).map((quote, index) => (
            <motion.div
              key={quote.substring(10)}
              layoutId={quote.substring(10)}
              initial={{ opacity: 1, x: index * (24 - index * 2), y: index * -(10 - index / 1.2) }}
              animate={{
                opacity: 1,
                x: index * (24 - index * 2),
                y: index * -(10 - index / 1.2),
                transition: { ease: 'easeOut' },
              }}
              exit={{ opacity: 0, x: 12, y: -4, transition: { duration: 0.1 } }}
              style={{
                filter: 'drop-shadow(0 1px 5px rgba(0, 0, 0, 0.06))',
                zIndex: items.length - index,
              }}
              className={clsx(
                'bg-white text-black text-lg p-4 px-3 md:px-4 w-64 h-full',
                index !== 0 && 'text-opacity-0 opacity-80!',
              )}
            >
              <svg width="45" height="36" className="fill-current md:-ml-1 text-[#FFEF31]">
                <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
              </svg>
              <div className="mt-2 px-0.5">
                <p className="font-medium text-base leading-snug">{quote}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button
        aria-label="Next"
        className="float-right no-tap mr-4 block bottom-0 right-0 absolute z-30 bg-yellow-600 bg-opacity-50 hover:bg-opacity-40 rounded-full h-10 w-10 active:bg-opacity-60"
        onClick={handleClick}
        style={{ marginTop: items.length * 5 + 4 }}
      >
        <svg
          aria-hidden
          className="text-gray-700 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  )
}

function Socials() {
  const items = [
    {
      title: 'Instagram',
      link: 'https://www.instagram.com/apologetikprojekt/',
      size: 19,
      svg: (
        <path
          transform="scale(0.95)"
          d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"
        />
      ),
    },
    {
      title: 'Youtube',
      link: 'https://www.youtube.com/@ApologetikProjekt',
      size: 19,
      svg: (
        <path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM9.54 8.4v7.18L15.82 12 9.54 8.41z" />
      ),
    },
    {
      title: 'TikTok',
      link: 'https://www.tiktok.com/@apologetikprojekt',
      size: 19,
      svg: (
        <path
          transform="scale(1.1)"
          d="M 15.918 4.063 C 15.789 3.997 15.665 3.924 15.543 3.846 C 15.191 3.613 14.869 3.339 14.583 3.029 C 13.866 2.21 13.598 1.378 13.5 0.796 L 13.504 0.796 C 13.422 0.313 13.455 0 13.461 0 L 10.197 0 L 10.197 12.618 C 10.197 12.787 10.197 12.955 10.191 13.12 C 10.191 13.141 10.189 13.159 10.188 13.182 C 10.188 13.19 10.188 13.2 10.185 13.209 C 10.185 13.212 10.185 13.215 10.185 13.217 C 10.116 14.136 9.593 14.96 8.792 15.416 C 8.38 15.65 7.915 15.773 7.441 15.772 C 5.921 15.772 4.689 14.533 4.689 13.001 C 4.689 11.471 5.921 10.231 7.441 10.231 C 7.729 10.231 8.015 10.276 8.289 10.365 L 8.292 7.043 C 6.614 6.825 4.92 7.321 3.623 8.409 C 3.06 8.898 2.587 9.481 2.225 10.132 C 2.087 10.369 1.568 11.324 1.504 12.872 C 1.465 13.752 1.729 14.662 1.855 15.039 L 1.855 15.047 C 1.934 15.269 2.241 16.025 2.74 16.662 C 3.144 17.174 3.62 17.624 4.154 17.996 L 4.154 17.988 L 4.162 17.996 C 5.742 19.069 7.493 18.999 7.493 18.999 C 7.797 18.987 8.812 18.999 9.965 18.452 C 11.244 17.846 11.973 16.943 11.973 16.943 C 12.438 16.404 12.808 15.79 13.067 15.126 C 13.363 14.349 13.461 13.418 13.461 13.047 L 13.461 6.352 C 13.5 6.376 14.027 6.725 14.027 6.725 C 14.027 6.725 14.788 7.212 15.972 7.529 C 16.823 7.754 17.968 7.802 17.968 7.802 L 17.968 4.562 C 17.567 4.606 16.751 4.479 15.918 4.063 Z"
        />
      ),
    },
  ]
  return (
    <div className="w-full md:w-82 px-5 py-7 md:py-6">
      <h2 className="text-3xl font-mono font-bold mb-3 leading-7">Werde Teil der Community</h2>
      <p className="leading-snug">Folge unserem Projekt auf Instagram, Youtube oder TikTok.</p>
      <div className="mt-4 flex flex-col space-y-1 font-normal">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.link}
            target="_blank"
            className="font-medium text-lg text-gray-800 hover:text-black"
          >
            <span className="w-24 flex items-center">
              <svg
                className="mr-2 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width={item.size}
                height={item.size}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {item.svg}
              </svg>
              {item.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
