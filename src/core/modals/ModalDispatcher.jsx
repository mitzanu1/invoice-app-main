
import React from 'react'
import history from 'core/history'
import { useSelector } from 'react-redux'
import { hideModal, selectModal } from '.'

export default function ModalDispatcher() {
  const { Component, props = {} } = useSelector(() => selectModal())
  const { onCancel = hideModal } = props
  React.useEffect(() => {
    return history.listen(() => {
      if (Component) hideModal()
    })
  })

  if (!Component) return null
  return (
    <Component {...props} onCancel={onCancel} />
  )
}