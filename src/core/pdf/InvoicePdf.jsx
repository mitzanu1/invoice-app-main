import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import _ from 'lodash'
import moment from 'moment'
import i18n, { DEFAULT_LANGUAGE } from 'core/i18n'


const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    padding: 15
  },
  section: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: 5,
    padding: 5,
    border: '1pt solid black',
    borderRadius: 4
  },
  header: { display: 'flex', flexDirection: 'row' },
  label: { fontSize: 11 },
  entry: { fontSize: 10, margin: 2 },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end'
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    margin: 10
  },
  table: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: 5,
    border: '1pt solid black'
  },
  total: {
    borderTop: '1pt solid black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 3
  },
  tr: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
    textAlign: 'left'
  },
  tc: {
    flex: 1,
    borderLeft: '1pt solid black',
    padding: 4,
    marginTop: -1
  },
  footer: { display: 'flex', flexDirection: 'row' },
  notes: {
    flex: 1,
    fontSize: 10,
    margin: '0 5pt'
  }
})

const Context = React.createContext()

function InvoicePdf({ invoice }) {
  const {
    series,
    number,
    currency = 'RON',
    customer,
    vendor,
    products,
    notes
  } = invoice || {}
  const { language = DEFAULT_LANGUAGE } = vendor || {}
  const t = (key) => i18n.t(key, { lng: language })

  return (
    <Context.Provider value={{ t, language }}>
      <Document
        title={`${t('invoice')} ${series}${number}`}
      >
        <Page
          size="A5"
          orientation="landscape"
          style={styles.page}
        >
          <View style={styles.header}>
            <Partner title={t('vendor')} partner={vendor} />
            <View style={styles.center}>
              <Text style={styles.title}>{t('invoice')}</Text>
              <Info invoice={invoice} />
            </View>
            <Partner title={t('customer')} partner={customer} />
          </View>
          <Products
            currency={currency}
            products={products}
          />
          <View style={styles.footer}>
            <View style={styles.notes}>
              <Text>{notes}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </Context.Provider>
  )
}

function Info({ invoice }) {
  const { series, number, date } = invoice || {}
  const { t, language } = React.useContext(Context)

  return (
    <View style={styles.section}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Entry label={t('series')} value={series} />
        <Entry label={t('no')} value={number} />
      </View>
      <Entry
        label={t('date')}
        value={moment(date).locale(language).format('L')}
      />
    </View>
  )
}

function Partner({ title, partner }) {
  const { t } = React.useContext(Context)
  const { name, cui, registryNo, iban, address } = partner || {}
  return (
    <View style={styles.section}>
      <Entry label={title} value={name} />
      {cui && <Entry label={t('cui')} value={cui} />}
      {registryNo && <Entry label={t('registryNo')} value={registryNo} />}
      {address && <Entry label={t('address')} value={address} />}
      {iban && <Entry label={t('iban')} value={iban} />}
    </View>
  )
}

function Entry({ label, value }) {
  return (
    <Text style={styles.entry}>
      <Text style={styles.label}>{label}</Text>
      {': '}
      <Text>{value}</Text>
    </Text>
  )
}


function Products({ products, currency }) {
  const { t } = React.useContext(Context)
  const columns = [
    {
      id: 'no',
      renderValue: (product, index) => `${index + 1}`,
      style: { flex: 0, width: 20, textAlign: 'center' }
    },
    {
      id: 'name',
      style: { flexGrow: 4 },
      label: t('product_or_service')
    },
    { id: 'uom' },
    { id: 'qty' },
    { id: 'price', label: `${t('price')} (${currency})` },
    {
      id: 'value',
      style: { flexGrow: 1.5 },
      label: `${t('value')} (${currency})`,
      renderValue: (product, index) => product.qty * product.price
    }
  ]

  const total = Object.values(products || {}).reduce((acc, { price, qty }) => {
    return acc + price * qty
  }, 0)

  return (
    <View style={styles.table}>
      <View style={[styles.tr, { borderBottom: '1pt solid black' }]}>
        {columns.map(({ id, label, style }, colIndex) => {
          return (
            <View
              key={id}
              style={[
                styles.tc,
                style,
                colIndex === 0 && { borderLeft: 0 }
              ]}
            >
              <Text>{label || t(id)}</Text>
            </View>
          )
        })}
      </View>
      {Object.values(products || {}).map((product, rowIndex) => {
        return (
          <View key={product.id} style={styles.tr}>
            {columns.map(({ id, renderValue = _.noop, style }, colIndex) => {
              const value = renderValue(product, rowIndex) || _.get(product, id)
              return (
                <View
                  key={id}
                  style={[
                    styles.tc,
                    style,
                    colIndex === 0 && { borderLeft: 0 }
                  ]}
                >
                  <Text>{value}</Text>
                </View>
              )
            })}
          </View>
        )
      })}
      <View style={[styles.tr, { flex: 1 }]}>
        {columns.map(({ id, style }, colIndex) => {
          return (
            <View
              key={id}
              style={[
                styles.tc,
                style,
                colIndex === 0 && { borderLeft: 0 }
              ]}
            />
          )
        })}
      </View>
      <View style={styles.total}>
        <Entry label={t('total')} value={`${total} ${currency}`} />
      </View>
    </View>
  )
}


export default React.memo(InvoicePdf)