'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'
import { GlobalSearch } from '@/components/Search'

interface Breadcrumb {
  label: string
  path?: string
}

interface NavBarProps {
  breadcrumbs?: Breadcrumb[]
}

export function NavBar({ breadcrumbs }: NavBarProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const menuId = 'mobile-menu-toggle'

  return (
    <nav className="sticky top-0 z-[100] bg-[rgba(15,15,26,0.85)] backdrop-blur-[12px] border-b border-white-8">
      <div className="flex items-center gap-4 max-w-[1400px] mx-auto py-3 px-8 max-md:py-2.5 max-md:px-4 max-md:gap-3 max-sm:gap-2">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5 no-underline text-inherit shrink-0">
          <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg text-sm font-bold text-white tracking-tight">
            JS
          </span>
          <span className="text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent max-md:hidden">
            JS Interview
          </span>
        </Link>

        {/* Middle: Navigation context (breadcrumbs) */}
        <div className="flex-1 flex items-center min-w-0">
          {!isHome && breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 text-base min-w-0 overflow-hidden max-md:text-sm">
              <Link
                href="/"
                className="flex items-center text-text-secondary no-underline transition-colors duration-normal hover:text-text-bright"
              >
                <Home size={14} />
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1 min-w-0 shrink">
                  <ChevronRight size={14} className="text-text-muted shrink-0" />
                  {crumb.path ? (
                    <Link
                      href={crumb.path}
                      className="flex items-center text-text-secondary no-underline transition-colors duration-normal whitespace-nowrap overflow-hidden text-ellipsis hover:text-text-bright max-md:max-w-[120px] max-sm:max-w-[60px]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-secondary font-medium whitespace-nowrap overflow-hidden text-ellipsis max-md:max-w-[120px] max-sm:max-w-[60px]">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Nav links + search */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/playground/event-loop"
            className="hidden md:flex py-1 px-3 text-base font-medium text-text-secondary no-underline rounded-md transition-all duration-fast hover:text-text-bright hover:bg-white-5"
          >
            Playground
          </Link>
          <div className="shrink-0 w-[280px] max-md:w-[200px] max-sm:w-[120px] max-[360px]:w-[100px]">
            <GlobalSearch />
          </div>
        </div>

        {/* Mobile menu toggle (checkbox hack) */}
        <input
          type="checkbox"
          id={menuId}
          className="absolute opacity-0 w-0 h-0"
          aria-hidden="true"
        />
        <label
          htmlFor={menuId}
          className="hidden max-md:flex min-w-[44px] min-h-[44px] items-center justify-center cursor-pointer z-[201] bg-transparent border-none"
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-text-secondary relative transition-colors duration-300 before:content-[''] before:absolute before:left-0 before:w-6 before:h-0.5 before:bg-text-secondary before:transition-transform before:duration-300 before:-top-2 after:content-[''] after:absolute after:left-0 after:w-6 after:h-0.5 after:bg-text-secondary after:transition-transform after:duration-300 after:-bottom-2 peer-checked:bg-transparent peer-checked:before:rotate-45 peer-checked:before:translate-x-[5px] peer-checked:before:translate-y-[6px] peer-checked:after:-rotate-45 peer-checked:after:translate-x-[5px] peer-checked:after:translate-y-[-6px]" />
        </label>

        {/* Mobile navigation panel */}
        <nav
          className="fixed top-0 -right-full w-[280px] h-screen bg-bg-secondary border-l border-white-8 pt-[70px] transition-[right] duration-300 z-[200] max-md:peer-checked:right-0"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col p-4">
            <Link
              href="/"
              className="flex items-center py-3 px-4 min-h-[44px] text-base text-text-secondary border-b border-white-8 no-underline transition-colors duration-fast hover:text-text-bright hover:bg-white-5"
            >
              Home
            </Link>
            <Link
              href="/concepts"
              className="flex items-center py-3 px-4 min-h-[44px] text-base text-text-secondary border-b border-white-8 no-underline transition-colors duration-fast hover:text-text-bright hover:bg-white-5"
            >
              JS Concepts
            </Link>
            <Link
              href="/concepts/dsa/patterns/two-pointers"
              className="flex items-center py-3 px-4 min-h-[44px] text-base text-text-secondary border-b border-white-8 no-underline transition-colors duration-fast hover:text-text-bright hover:bg-white-5"
            >
              DSA Patterns
            </Link>
            <Link
              href="/playground/event-loop"
              className="flex items-center py-3 px-4 min-h-[44px] text-base text-text-secondary border-b border-white-8 no-underline transition-colors duration-fast hover:text-text-bright hover:bg-white-5"
            >
              Playground
            </Link>
          </div>
        </nav>

        {/* Overlay to close menu */}
        <label
          htmlFor={menuId}
          className="hidden fixed inset-0 bg-black-50 z-[199] max-md:peer-checked:block"
          aria-hidden="true"
        />
      </div>
    </nav>
  )
}
