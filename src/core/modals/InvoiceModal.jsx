import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import styles from './index.module.scss'
import { Form, DatePicker, Input, InputNumber, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import Modal from 'antd/lib/modal/Modal'
import { hideModal } from 'core/modals'
import { useSelector } from 'react-redux'
import { selectData } from 'core/auth'


export default function InvoiceModal({
  title,
  invoice,
  onOk,
  onCancel = hideModal
}) {
  const { t } = useTranslation()
  const { series, number, vendor } = useSelector(() => selectData())
  const [loading, setLoader] = React.useState()

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues: _.omitBy({
      series,
      number: number + 1,
      date: moment().valueOf(),
      vendor,
      ...invoice
    }, _.isNil),
    onSubmit: async (values) => {
      try {
        setLoader(true)
        await onOk(values)
        hideModal()
      } catch (error) {
        message.error(t(error.message))
      } finally {
        setLoader(false)
      }
    }
  })

  return (
    <Modal
      visible
      keyboard={false}
      maskClosable={false}
      title={title}
      onCancel={onCancel}
      onOk={handleSubmit}
      okButtonProps={{ disabled: _.isEqual(values, invoice), loading }}
    >
      <Form
        layout="vertical"
        className={styles.modalForm}
      >
        <div className={styles.row}>
          <Form.Item
            htmlFor="series"
            label={t('series')}
            style={{ marginRight: 10 }}
          >
            <Input
              id="series"
              value={values.series}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item htmlFor="number" label={t('number')}>
            <InputNumber
              id="number"
              value={values.number}
              onChange={(value) => setFieldValue('number', value)}
            />
          </Form.Item>
        </div>
        <Form.Item htmlFor="date" label={t('date')}>
          <DatePicker
            id="date"
            fullscreen={false}
            allowClear={false}
            value={values.date && moment(values.date)}
            onChange={(_value) => setFieldValue('date', _value && moment(_value).valueOf())}
          />
        </Form.Item>
        <Form.Item
          htmlFor="notes"
          label={t('notes')}
        >
          <Input.TextArea
            id="notes"
            rows={5}
            value={_.get(values, 'notes', '')}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
