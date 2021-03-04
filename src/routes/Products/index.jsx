import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Button, Card, Tag, Input } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { showModal } from 'core/modals'
import { useTranslation } from 'react-i18next'
import ProductModal from 'core/modals/ProductModal'
import { createProduct, deleteProduct, selectProducts, updateProduct } from 'core/products'
import Header from 'layout/Header'


export default function Products() {
  const { t } = useTranslation()
  const products = useSelector(() => selectProducts())
  const [searchTerm, setSearchTerm] = React.useState('')

  return (
    <div className={styles.products}>
      <Header>
        <Button
          className={styles.button}
          onClick={() => showModal(ProductModal, {
            title: t('new_product'),
            onOk: (values) => createProduct({ values })
          })}
        >
          {t('new_product')}
        </Button>
        <div className={styles.searchBar}>
          <Input
            placeholder={t('search_products')}
            allowClear
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </Header>
      <div className={styles.content}>
        <div className={styles.list}>
          {_.orderBy(Object.values(products), ({ createdAt }) => moment(createdAt).valueOf(), 'desc')
            .filter(({ name = '' }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((product) => {
              const { id, name, uom } = product
              return (
                <div
                  key={id}
                  className={styles.productCard}
                >
                  <Card
                    title={name}
                    size="small"
                    className={styles.product}
                  >
                    <Tag>{uom}</Tag>
                  </Card>
                  <div className={styles.actions}>
                    <Button
                      icon={<EditOutlined />}
                      className={styles.button}
                      onClick={() => showModal(ProductModal, {
                        title: t('product'),
                        product,
                        onOk: (values) => updateProduct({ productId: id, values })
                      })
                      }
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => deleteProduct({ productId: id })}
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
