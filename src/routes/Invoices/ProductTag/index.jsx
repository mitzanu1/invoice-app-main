import React from 'react'
import { Tag } from 'antd'
import styles from './index.module.scss'
import ProductModal from 'core/modals/ProductModal'
import { showModal } from 'core/modals'


function ProductTag({
  title,
  currency,
  product,
  onChange,
  onDelete,
  ...props
}) {
  const { name, price, qty } = product || {}
  return (
    <Tag
      className={styles.productTag}
      closable={!!onDelete}
      onClose={onDelete}
      onClick={() => showModal(ProductModal, {
        title,
        product,
        onOk: onChange
      })}
      {...props}
    >
      {`${name} ${price * qty} ${currency}`}
    </Tag>
  )
}


export default React.memo(ProductTag)