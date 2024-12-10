import { Customer } from '@cde-platform/api/lib/model/customer'
import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { createColumnHelper } from '@tanstack/react-table'
import PagedTable, { PagedData } from './components/PagedTable'

type Props = {
  pagingOptions: CustomerPagingOptions
  onPagingOptionsSet: (opts: CustomerPagingOptions) => void
  onPagedDataRequested: (opts: CustomerPagingOptions) => Promise<PagedData<Customer>>
}

export function App({ pagingOptions, onPagingOptionsSet, onPagedDataRequested }: Props) {
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
    <div className="bg-white pt-10">
      <h3 className="font-sans font-semibold text-center text-2xl">Customer Data Explorer</h3>
      <PagedTable
        pageSizes={[5, 10]}
        columns={columns}
        pagingOptions={pagingOptions}
        onPagingOptionsChange={onPagingOptionsSet}
        onPagedDataRequested={onPagedDataRequested}
      />
    </div>
  )
}
