import React from 'react'
import moment from 'moment'
import { Button, Card, Tag, Divider } from 'antd'
import {
  PlusOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import styles from './index.module.scss'
import ProductModal from 'core/modals/ProductModal'
import { showModal } from 'core/modals'
import {
  updateInvoice,
  deleteInvoiceProduct,
  updateInvoiceProduct,
  createInvoiceProduct
} from 'core/invoices'
import { createProduct } from 'core/products'
import { createPartner } from 'core/partners'
import { useTranslation } from 'react-i18next'
import ProductTag from '../ProductTag'
import PartnerTag from '../PartnerTag'


function InvoiceCard({ invoice, actions }) {
  const { t } = useTranslation()
  const { currency = 'RON', series, number, date, customer, products } = invoice
  const total = Object.values(products || {}).reduce((acc, { price, qty }) => acc + price * qty, 0)

  return (
    <div className={styles.invoiceCard}>
      <Card
        size="small"
        className={styles.invoice}
        title={`${series}${number}`}
        extra={
          <>
            <Tag className={styles.tag}>{moment(date).format('L')}</Tag>
            <Tag className={styles.total}>{`${total} ${currency}`}</Tag>
          </>
        }
      >
        <PartnerTag
          title={t('customer')}
          partner={customer}
          placeholder={
            <>
              <div className={styles.partnerName}>{t('add_customer')}</div>
              <PlusCircleOutlined />
            </>
          }
          onChange={async (values) => {
            await createPartner({ values })
            await updateInvoice({
              invoiceId: invoice.id,
              values: { customer: values }
            })
          }}
        />
        <Divider className={styles.divider} />
        <div className={styles.productList}>
          {Object.values(products || {}).map((product) => (
            <ProductTag
              key={product.id}
              product={product}
              currency={currency}
              title={t('product')}
              onDelete={() => deleteInvoiceProduct({ invoiceId: invoice.id, productId: product.id })}
              onChange={async (values) => {
                await createProduct({ values })
                await updateInvoiceProduct({
                  invoiceId: invoice.id,
                  productId: product.id,
                  values
                })
              }}
            />
          ))}
          <Button
            className={styles.button}
            icon={<PlusOutlined />}
            size="small"
            onClick={() =>
              showModal(ProductModal, {
                title: t('product'),
                invoice,
                onOk: async (values) => {
                  await createProduct({ values })
                  await createInvoiceProduct({ invoiceId: invoice.id, values })
                }
              })
            }
          />
        </div>
      </Card>
      {actions}
    </div>
  )
}

export default React.memo(InvoiceCard)