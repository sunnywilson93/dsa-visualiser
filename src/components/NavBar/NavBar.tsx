'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'
import { GlobalSearch } from '@/components/Search'
import styles from './NavBar.module.css'

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

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Left: Brand */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>JS</span>
          <span className={styles.logoText}>JS Interview</span>
        </Link>

        {/* Middle: Navigation context (breadcrumbs) */}
        <div className={styles.middle}>
          {!isHome && breadcrumbs && breadcrumbs.length > 0 && (
            <div className={styles.breadcrumbs}>
              <Link href="/" className={styles.breadcrumbLink}>
                <Home size={14} />
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className={styles.breadcrumbItem}>
                  <ChevronRight size={14} className={styles.separator} />
                  {crumb.path ? (
                    <Link href={crumb.path} className={styles.breadcrumbLink}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Nav links + search */}
        <div className={styles.rightSection}>
          <Link href="/playground/event-loop" className={styles.navLink}>
            Playground
          </Link>
          <div className={styles.searchWrapper}>
            <GlobalSearch />
          </div>
        </div>
      </div>
    </nav>
  )
}
