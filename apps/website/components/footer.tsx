import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-gray-900 text-white mt-10">
        <div className="w-full flex flex-col justify-between sm:flex-row px-5 md:px-8 lg:px-16 py-12 max-w-6xl mx-auto">
          <div className="w-full sm:w-2/5 pr-6 flex flex-col space-y-4">
            <Link href="/" className="leading-none font-black tracking-wider text-xl font-mono">
              DAS APOLOGETIK <br /> PROJEKT
            </Link>
            <p className="opacity-80">
              Christen zurüsten, Zweiflern begegnen, Skeptikern antworten.
            </p>
          </div>

          <div className="w-full sm:w-3/5 flex flex-col sm:items-end mt-4 sm:mt-0 mr-1">
            <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-5">
              <li>
                <Link
                  href="/wer-wir-sind"
                  className="opacity-80 hover:opacity-90 hover:border-b border-white"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="opacity-80 hover:opacity-90 hover:border-b border-white"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/impressum"
                  className="opacity-80 hover:opacity-90 hover:border-b border-white"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="opacity-80 hover:opacity-90 hover:border-b border-white"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
            <div className="w-full sm:w-auto pt-4 flex items-end">
              <div className="flex flex-row space-x-4">
                <a title="Instagram" target="_blank" href="https://instagram.com/apologetikprojekt">
                  <svg
                    className="opacity-75 hover:opacity-90"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
                  </svg>
                </a>
                <a
                  title="Youtube"
                  target="_blank"
                  href="https://www.youtube.com/@ApologetikProjekt"
                >
                  <svg
                    className="opacity-75 hover:opacity-90"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM9.54 8.4v7.18L15.82 12 9.54 8.41z" />
                  </svg>
                </a>
                <a title="TikTok" target="_blank" href="https://tiktok.com/@apologetikprojekt">
                  <svg
                    className="opacity-75 hover:opacity-95"
                    height="18"
                    width="18"
                    viewBox="2 0 16 19"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="white"
                      d="M 15.918 4.063 C 15.789 3.997 15.665 3.924 15.543 3.846 C 15.191 3.613 14.869 3.339 14.583 3.029 C 13.866 2.21 13.598 1.378 13.5 0.796 L 13.504 0.796 C 13.422 0.313 13.455 0 13.461 0 L 10.197 0 L 10.197 12.618 C 10.197 12.787 10.197 12.955 10.191 13.12 C 10.191 13.141 10.189 13.159 10.188 13.182 C 10.188 13.19 10.188 13.2 10.185 13.209 C 10.185 13.212 10.185 13.215 10.185 13.217 C 10.116 14.136 9.593 14.96 8.792 15.416 C 8.38 15.65 7.915 15.773 7.441 15.772 C 5.921 15.772 4.689 14.533 4.689 13.001 C 4.689 11.471 5.921 10.231 7.441 10.231 C 7.729 10.231 8.015 10.276 8.289 10.365 L 8.292 7.043 C 6.614 6.825 4.92 7.321 3.623 8.409 C 3.06 8.898 2.587 9.481 2.225 10.132 C 2.087 10.369 1.568 11.324 1.504 12.872 C 1.465 13.752 1.729 14.662 1.855 15.039 L 1.855 15.047 C 1.934 15.269 2.241 16.025 2.74 16.662 C 3.144 17.174 3.62 17.624 4.154 17.996 L 4.154 17.988 L 4.162 17.996 C 5.742 19.069 7.493 18.999 7.493 18.999 C 7.797 18.987 8.812 18.999 9.965 18.452 C 11.244 17.846 11.973 16.943 11.973 16.943 C 12.438 16.404 12.808 15.79 13.067 15.126 C 13.363 14.349 13.461 13.418 13.461 13.047 L 13.461 6.352 C 13.5 6.376 14.027 6.725 14.027 6.725 C 14.027 6.725 14.788 7.212 15.972 7.529 C 16.823 7.754 17.968 7.802 17.968 7.802 L 17.968 4.562 C 17.567 4.606 16.751 4.479 15.918 4.063 Z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
