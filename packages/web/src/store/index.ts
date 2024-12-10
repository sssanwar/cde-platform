import { PayloadAction, configureStore } from '@reduxjs/toolkit'
import { appReducer, AppState } from './app.slice'

export type RootState = { app: AppState }

const store = configureStore<RootState, PayloadAction>({
  reducer: {
    app: appReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
})

export default store
