import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import { Popover, Button, Avatar } from 'antd'
import { logout, selectAuth } from 'core/auth'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'


export default function UserMenu({ className, style }) {
  const { t } = useTranslation()
  const [visible, setVisible] = React.useState()
  const { displayName } = useSelector(() => selectAuth())

  return (
    <Popover
      title={displayName}
      placement="bottomLeft"
      arrowPointAtCenter
      visible={visible}
      onVisibleChange={(_visible) => setVisible(_visible)}
      trigger={['click']}
      content={
        <div className={styles.menu}>
          <Button
            onClick={() => {
              setVisible(false)
              logout()
            }}
          >
            {t('logout')}
          </Button>
        </div>
      }
    >
      <Avatar
        className={clsx(styles.userMenu, className)}
        style={{ ...style, cursor: 'pointer' }}
      >
        {displayName.slice(0, 1)}
      </Avatar>
    </Popover>
  )
}
