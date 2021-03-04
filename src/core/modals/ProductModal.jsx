import React from 'react'
import _ from 'lodash'
import styles from './index.module.scss'
import { Form, AutoComplete, Input, InputNumber, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import Modal from 'antd/lib/modal/Modal'
import { hideModal } from 'core/modals'
import { useSelector } from 'react-redux'
import { selectProducts } from 'core/products'


export default function ProductModal({ title, product, onOk, onCancel = hideModal }) {
  const { t } = useTranslation()
  const [loading, setLoader] = React.useState()
  const products = useSelector(() => selectProducts())
  const productList = Object.values(products)

  const { values, setFieldValue, handleChange, setValues, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      qty: 1,
      ...product
    },
    onSubmit: async (values) => {
      setLoader(true)
      try {
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
      okButtonProps={{ disabled: _.isEqual(values, product), loading }}
    >
      <Form
        layout="vertical"
        className={styles.modalForm}
      >
        <Form.Item htmlFor="name" label={t('name')}>
          <AutoComplete
            id="name"
            defaultActiveFirstOption
            filterOption
            options={productList.map(({ name }) => ({ value: name }))}
            value={_.get(values, 'name', '')}
            onSearch={(_value) => setFieldValue('name', _value)}
            onSelect={(name) => {
              const product = _.find(productList, { name })
              setValues({ ...values, ..._.omit(product, ['qty', 'price']) })
            }}
          />
        </Form.Item>
        <div className={styles.row}>
          <Form.Item
            htmlFor="qty"
            label={t('qty')}
            style={{ marginRight: 10 }}
          >
            <InputNumber
              id="qty"
              value={_.get(values, 'qty', '')}
              onChange={(value) => setFieldValue('qty', value)}
            />
          </Form.Item>
          <Form.Item htmlFor="uom" label={t('uom')}>
            <Input
              id="uom"
              value={_.get(values, 'uom', '')}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
        <Form.Item
          htmlFor="price"
          label={t('price')}
        >
          <InputNumber
            id="price"
            value={_.get(values, 'price', '')}
            onChange={(value) => setFieldValue('price', value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
