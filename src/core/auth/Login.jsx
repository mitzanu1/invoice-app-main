import React from 'react'
import { Form, Button, Card, Input } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { useFormik } from 'formik'
import {
  googleLogin,
  passwordLoginRegister,
  passwordReset
} from 'core/auth'
import styles from './index.module.scss'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectLoader } from 'core/loaders'


export default function LoginModal() {
  const { t } = useTranslation()
  const loggingIn = useSelector(() => selectLoader('loggingIn'))
  const resettingPassword = useSelector(() => selectLoader('resettingPassword'))

  const {
    values,
    errors,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: (values) => passwordLoginRegister(values)
  })

  return (
    <div className={styles.login}>
      <Card
        title={t('login')}
        size="small"
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Form
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            label={t('email')}
            validateStatus={errors.email && 'error'}
            help={errors.email}
          >
            <Input
              id="email"
              value={values.email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label={t('password')}
            validateStatus={errors.password && 'error'}
            help={errors.password}
          >
            <Input.Password
              id="password"
              value={values.password}
              onChange={handleChange}
            />
            <Button
              type="link"
              size="small"
              disabled={!values.email && !errors.email}
              className={styles.link}
              loading={resettingPassword}
              onClick={() => passwordReset({ email: values.email })}
            >
              {t('forgot_password')}
            </Button>
          </Form.Item>
          <Button
            style={{ marginTop: 0 }}
            type="primary"
            onClick={handleSubmit}
            className={styles.button}
            loading={loggingIn}
          >
            Submit
          </Button>
          <Button
            className={styles.button}
            onClick={googleLogin}
          >
            <GoogleOutlined /> Sign in with Google
          </Button>

        </Form>
      </Card>
    </div>
  )
}

