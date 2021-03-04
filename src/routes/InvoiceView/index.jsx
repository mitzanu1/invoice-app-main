import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { PDFViewer } from '@react-pdf/renderer'
import InvoicePdf from 'core/pdf/InvoicePdf'
import { selectInvoices } from 'core/invoices'
import { Button } from 'antd'
import styles from './index.module.scss'
import history from 'core/history'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { downloadInvoicePdf } from 'core/pdf'
import Header from 'layout/Header'
import { useTranslation } from 'react-i18next'


export default function InvoiceView() {
  const { t } = useTranslation()
  const { id } = useParams()
  const invoices = useSelector(() => selectInvoices())
  const invoice = Object.values(invoices).find((invoice) => invoice.id === id)
  if (!invoice) return null
  return (
    <div className={styles.invoiceView}>
      <Header>
        <Button
          className={styles.button}
          onClick={() => history.goBack()}
          icon={<ArrowLeftOutlined />}
        />
        <Button
          className={styles.button}
          icon={<DownloadOutlined />}
          onClick={() => downloadInvoicePdf({ invoice })}
        >
          {t('download')}
        </Button>
      </Header>
      <PDFViewer height="100%">
        <InvoicePdf invoice={invoice} />
      </PDFViewer>
    </div>

  )
}