import React from 'react'
import _ from 'lodash'
import styles from './index.module.scss'
import { message, Form, AutoComplete, Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import Modal from 'antd/lib/modal/Modal'
import { hideModal } from 'core/modals'
import { useSelector } from 'react-redux'
import { selectPartners } from 'core/partners'
import { DEFAULT_LANGUAGE, LANGUAGE_LIST } from 'core/i18n'
import { selectData } from 'core/auth'


export default function PartnerModal({ title, partner, onOk, onCancel = hideModal }) {
  const { t } = useTranslation()
  const { language = DEFAULT_LANGUAGE } = useSelector(() => selectData())
  const partners = useSelector(() => selectPartners())
  const partnerList = Object.values(partners)

  const [loading, setLoader] = React.useState()

  const { values, setValues, handleChange, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      language,
      ...partner
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
      title={title}
      visible
      keyboard={false}
      maskClosable={false}
      onCancel={onCancel}
      onOk={handleSubmit}
      okButtonProps={{ disabled: _.isEqual(values, partner), loading }}
    >
      <Form
        layout="vertical"
        className={styles.modalForm}
      >
        <div className={styles.row}>
          <Form.Item
            htmlFor="name"
            label={t('name')}
            style={{ marginRight: 10, flex: 1 }}
          >
            <AutoComplete
              id="name"
              defaultActiveFirstOption
              filterOption
              options={partnerList.map(({ name }) => ({ value: name }))}
              value={_.get(values, 'name', '')}
              onSearch={(_value) => setFieldValue('name', _value)}
              onSelect={(name) => setValues(_.find(partnerList, { name }))}
            />
          </Form.Item>
          <Form.Item
            htmlFor="language"
            label={t('language')}
            style={{ width: '5rem' }}
          >
            <Select
              id="language"
              value={_.get(values, 'language', '')}
              onChange={(language) => setFieldValue('language', language)}
            >
              {LANGUAGE_LIST.map((language) => (
                <Select.Option
                  key={language}
                  value={language}
                >
                  {t(language)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className={styles.row}>
          <Form.Item
            htmlFor="cui"
            label={t('cui')}
            style={{ marginRight: 10, flex: 1 }}
          >
            <Input
              value={_.get(values, 'cui', '')}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            htmlFor="registryNo"
            label={t('registryNo')}
            style={{ flex: 1 }}
          >
            <Input
              id="registryNo"
              value={_.get(values, 'registryNo', '')}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
        <div className={styles.row}>
          <Form.Item
            htmlFor="email"
            label={t('email')}
            style={{ marginRight: 10, flex: 1 }}
          >
            <Input
              id="email"
              value={_.get(values, 'email', '')}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            htmlFor="phone"
            label={t('phone')}
          >
            <Input
              id="phone"
              value={_.get(values, 'phone', '')}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
        <Form.Item
          htmlFor="address"
          label={t('address')}
        >
          <Input
            id="address"
            value={_.get(values, 'address', '')}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          htmlFor="iban"
          label={t('iban')}
        >
          <Input
            id="iban"
            value={_.get(values, 'iban', '')}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
