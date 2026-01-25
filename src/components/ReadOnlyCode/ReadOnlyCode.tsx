'use client'

import styles from './ReadOnlyCode.module.css'

interface ReadOnlyCodeProps {
  code: string
  className?: string
}

export function ReadOnlyCode({ code, className }: ReadOnlyCodeProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Code</span>
        <span className={styles.badge}>Read Only</span>
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
