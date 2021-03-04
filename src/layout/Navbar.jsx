import React from 'react'
import { Button, Card } from 'antd'
import history from 'core/history'
import { FileOutlined, TeamOutlined, ShoppingCartOutlined, SettingOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { matchPath, useLocation } from 'react-router-dom'
import { showModal } from 'core/modals'
import PartnerModal from 'core/modals/PartnerModal'
import { useTranslation } from 'react-i18next'
import { createVendor } from 'core/partners'
import { useSelector } from 'react-redux'
import { selectData } from 'core/auth'


export default function Navbar() {
  const { t } = useTranslation()
  const { vendor } = useSelector(() => selectData())
  const { pathname } = useLocation()
  return (
    <Card
      size="small"
      className={styles.navbar}
    >
      <div className={styles.left}>
        <Button
          className={styles.button}
          icon={<FileOutlined />}
          type={matchPath(pathname, '/invoices') && 'primary'}
          onClick={() => history.push('/invoices')}
        />
        <Button
          className={styles.button}
          icon={<TeamOutlined />}
          type={matchPath(pathname, '/partners') && 'primary'}
          onClick={() => history.push('/partners')}
        />
        <Button
          className={styles.button}
          icon={<ShoppingCartOutlined />}
          type={matchPath(pathname, '/products') && 'primary'}
          onClick={() => history.push('/products')}
        />
      </div>
      <div className={styles.right}>
        <Button
          className={styles.button}
          icon={<SettingOutlined />}
          onClick={() => showModal(PartnerModal, {
            title: t('my_info'),
            partner: vendor,
            onOk: (values) => createVendor({ values })
          })}
        />
      </div>
    </Card>
  )
}
