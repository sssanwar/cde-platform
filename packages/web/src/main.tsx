import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { CustomersApi } from './api/customers'
import AppContainer from './App.container'
import { config } from './config'
import store from './store'

const rootElm = document.getElementById('root')
if (!rootElm) throw new Error('Failed to find the root element')

const customerApi = CustomersApi(config.apiBaseUrl)

createRoot(rootElm).render(
  <StrictMode>
    <Provider store={store}>
      <AppContainer onPagedDataRequested={customerApi.getPagedData} />
    </Provider>
  </StrictMode>,
)
