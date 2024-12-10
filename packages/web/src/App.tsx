import { Customer } from '@cde-platform/api/lib/model/customer'
import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { createColumnHelper } from '@tanstack/react-table'
import PagedTable, { PagedData } from './components/PagedTable'

export type AppProps = {
  pagingOptions: CustomerPagingOptions
  errorMessage?: string
  onPagingOptionsSet: (opts: CustomerPagingOptions) => void
  onPagedDataRequested: (opts: CustomerPagingOptions) => Promise<PagedData<Customer>>
  onError: (message?: string) => void
}

export function App({ pagingOptions, errorMessage, onPagingOptionsSet, onPagedDataRequested, onError }: AppProps) {
  const columnHelper = createColumnHelper<Customer>()

  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: ctx => ctx.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Full Name',
      cell: ctx => ctx.getValue(),
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: ctx => <i>{ctx.getValue()}</i>,
    }),
    columnHelper.accessor('registered', {
      header: () => 'Registration Date',
      cell: ctx => new Date(ctx.getValue()).toDateString(),
    }),
  ]

  return (
    <div className="bg-white h-screen pt-10">
      <h3 className="font-sans font-semibold text-center text-2xl">Customer Data Explorer</h3>
      <PagedTable
        pageSizes={[5, 10]}
        columns={columns}
        pagingOptions={pagingOptions}
        onPagingOptionsChange={onPagingOptionsSet}
        onPagedDataRequested={onPagedDataRequested}
        onError={onError}
      />
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 mx-auto text-red-700 px-4 py-3 rounded relative max-w-4xl" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              onClick={() => onError()}
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
    </div>
  )
}
