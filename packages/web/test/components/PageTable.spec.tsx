import { Paginator } from '@cde-platform/api/src/utils/paginator'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PageTable, { TablePagingOptions } from '../../src/components/PagedTable'
import '@testing-library/jest-dom'

type Data = { id: number; name: string }
type DataPagingOptions = TablePagingOptions<keyof Data>

const columnHelper = createColumnHelper<Data>()

const mockPageData = Paginator([
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
  { id: 4, name: 'd' },
  { id: 5, name: 'e' },
  { id: 6, name: 'f' },
])

const columns: ColumnDef<Data, any>[] = [
  columnHelper.accessor('id', {
    header: () => 'ID',
    cell: ctx => ctx.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => 'Name',
    cell: ctx => ctx.getValue(),
  }),
]

const pagingOptions: DataPagingOptions = { page: 1, size: 2, dir: 'asc', field: 'id' }

const getPageData = async (opts: DataPagingOptions) => mockPageData(opts)

const renderTable = (opts: DataPagingOptions, onPagingOptionsChange: (opts: DataPagingOptions) => void = () => {}) => {
  return render(
    <PageTable
      pageSizes={[2, 3]}
      columns={columns}
      pagingOptions={opts}
      onPagedDataRequested={getPageData}
      onPagingOptionsChange={onPagingOptionsChange}
    />,
  )
}

describe('components/PagedTable', () => {
  it('renders table with columns and rows', async () => {
    const result = renderTable(pagingOptions)
    const table = await result.findByRole('table')
    const thead = table.getElementsByTagName('thead')[0]
    expect(thead.children[0].children.length).toBe(2) // check columns

    const tbody = table.getElementsByTagName('tbody')[0]
    expect(tbody.children.length).toBe(2) // check data rows
  })

  it('navigates to first page', async () => {
    let currentPaging = { ...pagingOptions, page: 3 }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const buttons = await result.findAllByRole('button')
    const firstButton = buttons[0]

    await userEvent.click(firstButton)
    expect(currentPaging.page).toEqual(1)
  })

  it('navigates to prev page', async () => {
    let currentPaging = { ...pagingOptions, page: 2 }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const buttons = await result.findAllByRole('button')
    const prevButton = buttons[1]

    await userEvent.click(prevButton)
    expect(currentPaging.page).toEqual(1)
  })

  it('navigates to next page', async () => {
    let currentPaging = { ...pagingOptions, page: 2 }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const buttons = await result.findAllByRole('button')
    const nextButton = buttons[2]

    await userEvent.click(nextButton)
    expect(currentPaging.page).toEqual(3)
  })

  it('navigates to last page', async () => {
    let currentPaging = { ...pagingOptions, page: 1 }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const buttons = await result.findAllByRole('button')
    const lastButton = buttons[3]

    await userEvent.click(lastButton)
    expect(currentPaging.page).toEqual(3)
  })

  it('updates page size', async () => {
    let currentPaging = { ...pagingOptions, page: 2, size: 2 }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const combo = await result.findByRole('combobox')

    await userEvent.selectOptions(combo, '3')
    expect(currentPaging.page).toEqual(1)
    expect(currentPaging.size).toEqual(3)
  })

  it('sorts by column', async () => {
    let currentPaging: DataPagingOptions = { ...pagingOptions, field: 'id' }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const table = await result.findByRole('table')
    const nameHeader = table.getElementsByTagName('th')[1].children[0]
    expect(currentPaging.field).toEqual('id')

    await userEvent.click(nameHeader)
    expect(currentPaging.field).toEqual('name')
  })

  it('sorts by direction', async () => {
    let currentPaging: DataPagingOptions = { ...pagingOptions }
    const result = renderTable(currentPaging, opts => (currentPaging = opts))
    const table = await result.findByRole('table')
    const idHeader = table.getElementsByTagName('th')[0].children[0]
    expect(currentPaging.field).toEqual('id')

    await userEvent.click(idHeader)
    expect(currentPaging.dir).toEqual('desc')
  })
})
