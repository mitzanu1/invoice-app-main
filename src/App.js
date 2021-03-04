import React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { selectAuth } from 'core/auth'
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from 'core/auth/Login'
import Layout from 'layout/Layout'
import Invoices from 'routes/Invoices'
import Partners from 'routes/Partners'
import InvoiceView from 'routes/InvoiceView'
import Products from 'routes/Products'


const routes = [
  { path: '/invoices', exact: true, component: Invoices },
  { path: '/partners', exact: true, component: Partners },
  { path: '/products', exact: true, component: Products },
  { path: '/invoices/view/:id', exact: true, component: InvoiceView }
]

export default function App() {
  const { authenticated } = useSelector(() => selectAuth())
  return (
    <Layout>
      {!authenticated && <Login />}
      {authenticated &&
        <Switch>
          {routes.map(({ path, exact, component }) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              component={component}
            />
          ))}
          <Redirect to={_.first(routes).path} />
        </Switch>
      }
    </Layout>
  )
}
