import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit/react'

export interface AppState {
  pagingOptions: CustomerPagingOptions
  error?: string
}

const initialState: AppState = {
  pagingOptions: { size: 5, dir: 'asc', page: 1, field: 'name' },
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPagingOptions: (state, action: PayloadAction<CustomerPagingOptions>) => {
      state.pagingOptions = action.payload
    },
  },
})

export const { setPagingOptions } = appSlice.actions

export const appReducer = appSlice.reducer as Reducer<AppState>
