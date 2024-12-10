import { PagingOptions } from '@cde-platform/api/lib/model/paging'
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState, ColumnDef } from '@tanstack/react-table'
import { useState, useEffect } from 'react'

export type TablePagingOptions<F> = PagingOptions & { field: F }
export type PagedData<T> = { total: number; page: number; data: T[] }

export type PagedTableProps<T, V, F> = {
  columns: ColumnDef<T, V>[]
  pagingOptions: TablePagingOptions<F>
  pageSizes: number[]
  onPagedDataRequested: (opts: TablePagingOptions<F>) => Promise<PagedData<T>>
  onPagingOptionsChange: (opts: TablePagingOptions<F>) => void
  onError: (message?: string) => void
}

export default function PagedTable<T, V, F>(props: PagedTableProps<T, V, F>) {
  const { pageSizes, pagingOptions, onPagedDataRequested, onPagingOptionsChange, onError } = props
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagedData, setPagedData] = useState<PagedData<T>>({
    total: 0,
    page: 1,
    data: [],
  })

  const columnSorted = (id: string) => (pagingOptions.field === id ? pagingOptions.dir : undefined)

  const table = useReactTable({
    data: pagedData.data,
    columns: props.columns,
    state: { sorting },
    initialState: {
      pagination: {
        pageSize: pagingOptions.size,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    rowCount: pagedData.total,
  })

  const disabled = {
    prev: pagingOptions.page === 1,
    next: pagingOptions.page === table.getPageCount(),
  }

  useEffect(() => {
    onPagedDataRequested(pagingOptions)
      .then(setPagedData)
      .catch(err => {
        onError(err.message)
        console.error(err.message)
      })
  }, [pagingOptions])

  return (
    <div className="flex flex-col max-w-4xl mx-auto py-5">
      <table className="border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b text-gray-800 uppercase">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 pr-2 py-4 font-medium text-left">
                  {header.isPlaceholder ? undefined : (
                    <div
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer select-none flex min-w-[36px]' : '',
                        onClick: () => {
                          header.column.getToggleSortingHandler()
                          onPagingOptionsChange({
                            ...pagingOptions,
                            field: header.column.id as F,
                            dir:
                              header.column.id === pagingOptions.field
                                ? pagingOptions.dir === 'asc'
                                  ? 'desc'
                                  : 'asc'
                                : pagingOptions.dir,
                          })
                        },
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <span className="pl-2">↑</span>,
                        desc: <span className="pl-2">↓</span>,
                      }[columnSorted(header.column.id) as string] ?? undefined}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 pt-[10px] pb-[12px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex sm:flex-row flex-col w-full mt-8 items-center gap-2 text-xs">
        <div className="sm:mr-auto sm:mb-0 mb-2">
          <span className="mr-2">Page size</span>
          <select
            className="border p-1 rounded w-16 border-gray-200"
            value={table.getState().pagination.pageSize}
            onChange={e => {
              const size = Number(e.target.value)
              table.setPageSize(size)
              onPagingOptionsChange({ ...pagingOptions, page: 1, size })
            }}
          >
            {pageSizes.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="button"
            className={`w-7 ${disabled.prev ? 'text-gray-300 bg-gray-100' : 'hover:bg-gray-200 hover:curstor-pointer bg-gray-100'} rounded p-1`}
            onClick={() => onPagingOptionsChange({ ...pagingOptions, page: 1 })}
            disabled={disabled.prev}
            value="<<"
          />
          <input
            type="button"
            className={`w-7 ${disabled.prev ? 'text-gray-300 bg-gray-100' : 'hover:bg-gray-200 hover:curstor-pointer bg-gray-100'} rounded p-1`}
            onClick={() => onPagingOptionsChange({ ...pagingOptions, page: pagingOptions.page - 1 })}
            disabled={disabled.prev}
            value="<"
          />
          <span className="flex items-center gap-1">
            {pagingOptions.page} / {table.getPageCount()}
          </span>
          <input
            type="button"
            className={`w-7 ${disabled.next ? 'text-gray-300 bg-gray-100' : 'hover:bg-gray-200 hover:curstor-pointer bg-gray-100'} rounded p-1`}
            onClick={() => onPagingOptionsChange({ ...pagingOptions, page: pagingOptions.page + 1 })}
            disabled={disabled.next}
            value=">"
          />
          <input
            type="button"
            className={`w-7 ${disabled.next ? 'text-gray-300 bg-gray-100' : 'hover:bg-gray-200 hover:curstor-pointer bg-gray-100'} rounded p-1`}
            onClick={() => onPagingOptionsChange({ ...pagingOptions, page: table.getPageCount() })}
            disabled={disabled.next}
            value=">>"
          />
        </div>
      </div>
    </div>
  )
}
