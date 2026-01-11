import { Link } from 'react-router-dom'
import { NavBar } from '@/components'
import { exampleCategories, getExamplesByCategory } from '@/data/examples'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <div className={styles.container}>
      <NavBar />

      <header className={styles.header}>
        <h1 className={styles.title}>JS Interview</h1>
        <p className={styles.subtitle}>
          Master JavaScript with interactive code visualization
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {exampleCategories.map((category) => {
            const problems = getExamplesByCategory(category.id)
            return (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className={styles.card}
              >
                <span className={styles.icon}>{category.icon}</span>
                <h2 className={styles.cardTitle}>{category.name}</h2>
                <p className={styles.cardDescription}>{category.description}</p>
                <span className={styles.count}>{problems.length} problems</span>
              </Link>
            )
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Select a category to start practicing</p>
      </footer>
    </div>
  )
}
