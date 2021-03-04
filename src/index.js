import React from 'react'
import ReactDOM from 'react-dom'

import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { initAuth } from 'core/auth'
import store from 'store'
import history from 'core/history'

import 'antd/dist/antd.css'
import 'index.scss'
import 'core/i18n'
import { Spin } from 'antd'


const render = (component) => {
  ReactDOM.render(component, document.getElementById('root'))
}

Promise.resolve()
  .then(() => render(<Spin className="centered" />))
  .then(() => initAuth())
  .then(() => import('App'))
  .then(({ default: App }) => render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  ))


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

