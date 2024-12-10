import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit/react'

export interface AppState {
  pagingOptions: CustomerPagingOptions
  errorMessage?: string
}

const initialState: AppState = {
  pagingOptions: { size: 5, dir: 'asc', page: 1, field: 'name' },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPagingOptions: (state, action: PayloadAction<CustomerPagingOptions>) => {
      state.pagingOptions = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<string | undefined>) => {
      state.errorMessage = action.payload
    },
  },
})

export const { setPagingOptions, setErrorMessage } = appSlice.actions

export const appReducer = appSlice.reducer as Reducer<AppState>
