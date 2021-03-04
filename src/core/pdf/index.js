import React from 'react'
import { pdf } from '@react-pdf/renderer'
import InvoicePdf from './InvoicePdf'
import FileSaver from 'file-saver'
import i18n from 'core/i18n'


export const downloadInvoicePdf = async ({ invoice }) => {
  const document = pdf([])
  document.updateContainer(<InvoicePdf invoice={invoice} />)
  const blob = await document.toBlob()
  const { series, number } = invoice || {}
  FileSaver.saveAs(blob, `${i18n.t('invoice')} ${series}${number}.pdf`)
}