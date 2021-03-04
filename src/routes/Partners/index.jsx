import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Button, Card, Tag, Input } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { showModal } from 'core/modals'
import PartnerModal from 'core/modals/PartnerModal'
import { createPartner, deletePartner, selectPartners, updatePartner } from 'core/partners'
import { useTranslation } from 'react-i18next'
import Header from 'layout/Header'


export default function Partners() {
  const { t } = useTranslation()
  const partners = useSelector(() => selectPartners())
  const [searchTerm, setSearchTerm] = React.useState('')

  return (
    <div className={styles.partners}>
      <Header>
        <Button
          className={styles.button}
          onClick={() => showModal(PartnerModal, {
            title: t('new_partner'),
            onOk: (values) => createPartner({ values })
          })}
        >
          {t('new_partner')}
        </Button>
        <div className={styles.searchBar}>
          <Input
            placeholder={t('search_partners')}
            allowClear
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </Header>
      <div className={styles.content}>
        <div className={styles.list}>
          {_.orderBy(Object.values(partners), ({ createdAt }) => moment(createdAt).valueOf(), 'desc')
            .filter(({ name = '' }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((partner) => {
              const { id, name, cui } = partner
              return (
                <div
                  key={id}
                  className={styles.partnerCard}
                >
                  <Card
                    title={name}
                    size="small"
                    className={styles.partner}
                  >
                    <Tag>{cui}</Tag>
                  </Card>
                  <div className={styles.actions}>
                    <Button
                      icon={<EditOutlined />}
                      className={styles.button}
                      onClick={() => showModal(PartnerModal, {
                        title: t('partner'),
                        partner,
                        onOk: (values) => updatePartner({ partnerId: id, values })
                      })
                      }
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => deletePartner({ partnerId: id })}
                      className={styles.button}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
