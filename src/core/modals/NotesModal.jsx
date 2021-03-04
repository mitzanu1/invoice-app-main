import React from 'react'
import _ from 'lodash'
import styles from './index.module.scss'
import { Form, Input, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import Modal from 'antd/lib/modal/Modal'
import { hideModal } from 'core/modals'


const { TextArea } = Input

export default function NotesModal({
  entity,
  onOk,
  onCancel = hideModal
}) {
  const { t } = useTranslation()
  const [loading, setLoader] = React.useState()

  const {
    values,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues: _.pick(entity, ['notes']),
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
      title={t('notes')}
      onCancel={onCancel}
      onOk={handleSubmit}
      okButtonProps={{ loading }}
    >
      <Form
        layout="vertical"
        className={styles.modalForm}
      >
        <Form.Item
          htmlFor="notes"
          style={{ marginRight: 10 }}
        >
          <TextArea
            id="notes"
            rows={6}
            value={_.get(values, 'notes', '')}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
