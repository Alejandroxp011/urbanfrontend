'use client'
import styles from './page.module.css'
import LoginPage from './(auth)/login/page'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <LoginPage />
      </div>
    </main>
  )
}