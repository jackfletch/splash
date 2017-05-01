import React from 'react'
import ReactDOM from 'react-dom'

// components
import App from './app'
import './index.css'

const rootEl = document.getElementById('root')

ReactDOM.render(
  <App />,
  rootEl
)

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default // eslint-disable-line global-require
    ReactDOM.render(
      <NextApp />,
      rootEl
    )
  })
}
