import customers from '@cde-platform/api/src/data/customers.json'
import { Paginator } from '@cde-platform/api/src/utils/paginator'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import AppContainer from '../src/App.container'
import store from '../src/store'

describe('App.container', () => {
  const getPagedData = Paginator(customers)

  const renderApp = () => {
    return render(
      <Provider store={store}>
        <AppContainer onPagedDataRequested={opts => Promise.resolve(getPagedData(opts))} />
      </Provider>,
    )
  }

  it('renders App ', async () => {
    const result = renderApp()
    const table = await result.findByRole('table')
    const tbody = table.getElementsByTagName('tbody')[0]
    expect(tbody.children.length).toBe(5)

    const combo = await result.findByRole('combobox')

    await userEvent.selectOptions(combo, '10')
    expect(tbody.children.length).toBe(10)
  })
})
