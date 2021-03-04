import React from 'react'
import { Tag } from 'antd'
import { showModal } from 'core/modals'
import PartnerModal from 'core/modals/PartnerModal'
import styles from './index.module.scss'


function PartnerTag({ title, placeholder, partner, onChange, ...props }) {
  const { name } = partner || {}
  return (
    <Tag
      className={styles.partnerTag}
      onClick={() => showModal(PartnerModal, {
        title,
        partner,
        onOk: onChange
      })}
      {...props}
    >
      {name || placeholder}
    </Tag>
  )
}


export default React.memo(PartnerTag)