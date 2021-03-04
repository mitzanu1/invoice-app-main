import React from 'react'
import styles from './index.module.scss'
import Navbar from './Navbar'
import ModalDispatcher from 'core/modals/ModalDispatcher'
import { useSelector } from 'react-redux'
import { selectAuth } from 'core/auth'
import { selectLoader } from 'core/loaders'
import { Spin } from 'antd'


export default function Layout({ children }) {
  const { authenticated } = useSelector(() => selectAuth())
  const initializing = useSelector(() => selectLoader('initializing'))
  return (
    <main className={styles.layout}>
      {authenticated && <Navbar />}
      <div className={styles.content}>
        {initializing && <Spin className="centered" />}
        {!initializing &&
          <>
            {children}
          </>
        }
      </div>
      <ModalDispatcher />
    </main>
  )
}
