import React from 'react'
import { Card } from 'antd'
import UserMenu from './UserMenu'
import styles from './index.module.scss'


export default function Header({ children }) {
  return (
    <Card
      size="small"
      className={styles.header}
    >
      <div className={styles.children}>
        {children}
      </div>
      <UserMenu />
    </Card>
  )
}

