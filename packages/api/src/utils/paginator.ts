import chunk from 'lodash/chunk'
import { InputError } from './errors'
import { PagingOptions } from '../model/paging'

export type PagingResult<T> = {
  total: number
  page: number
  data: T[]
}

export const Paginator = <T extends object>(data: T[]) => {
  return (options: PagingOptions & { field: keyof T }): PagingResult<T> => {
    const key = options.field
    const asc = options.dir === 'asc' ? 1 : -1
    const sorted = [...data].sort((a, b) => (a[key] < b[key] ? -1 : 1) * asc)
    const chunked = chunk(sorted, options.size)

    if (options.page > chunked.length) {
      throw new InputError('Page number exceeds total number of pages')
    }

    return { total: data.length, page: options.page, data: chunked[options.page - 1] }
  }
}
