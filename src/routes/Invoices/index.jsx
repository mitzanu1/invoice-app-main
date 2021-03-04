import React from 'react'
import _ from 'lodash'
import { Button, Input, DatePicker } from 'antd'
import {
  PrinterOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import InvoiceModal from 'core/modals/InvoiceModal'
import { showModal } from 'core/modals'
import {
  createInvoice,
  deleteInvoice,
  selectInvoices,
  updateInvoice
} from 'core/invoices'

import { selectParams, setMonth, setSearch } from './actions'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import InvoiceCard from './InvoiceCard'
import { downloadInvoicePdf } from 'core/pdf'
import history from 'core/history'
import Header from 'layout/Header'


export default function Invoices() {
  const { t } = useTranslation()
  const invoices = useSelector(() => selectInvoices())
  const { month, search = '' } = useSelector(() => selectParams())

  const invoiceList = _.orderBy(Object.values(invoices), ({ createdAt }) => moment(createdAt).valueOf(), 'desc')
    .filter(({ series = '', number = 0 }) => [series, number]
      .join('')
      .toLowerCase()
      .includes(search.toLowerCase())
    )
    .filter(({ date }) => !month || moment(date).isBetween(
      moment(month).startOf('month'),
      moment(month).endOf('month')
    ))


  return (
    <div className={styles.invoices}>
      <Header>
        <Button
          className={styles.button}
          onClick={() => showModal(InvoiceModal, {
            title: t('new_invoice'),
            onOk: (values) => createInvoice({ values })
          })}
        >
          {t('new_invoice')}
        </Button>
        <div className={styles.searchBar}>
          <Input
            placeholder={t('search_invoices')}
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className={styles.dateRange}>
          <DatePicker
            picker="month"
            value={month}
            format="MMM Y"
            placeholder={t('month')}
            onChange={(month) => setMonth(month)}
          />
        </div>
      </Header>
      <div className={styles.content}>
        <div className={styles.list}>
          {invoiceList.map((invoice) => {
            return (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                actions={
                  <div className={styles.actions}>
                    <Button
                      icon={<EditOutlined />}
                      className={styles.button}
                      onClick={() => showModal(InvoiceModal, {
                        title: t('edit_invoice'),
                        invoice,
                        onOk: (values) => updateInvoice({ invoiceId: invoice.id, values })
                      })}
                    />
                    <Button
                      icon={<PrinterOutlined />}
                      className={styles.downloadButton}
                      onClick={() => downloadInvoicePdf({ invoice })}
                    />
                    <Button
                      icon={<PrinterOutlined />}
                      className={styles.previewButton}
                      onClick={() => history.push(`/invoices/view/${invoice.id}`)}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      className={styles.button}
                      onClick={() => deleteInvoice({ invoiceId: invoice.id })}
                    />
                  </div>
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

