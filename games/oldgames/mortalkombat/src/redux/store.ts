import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
})

export type AppDispatchType = typeof store.dispatch

export type AppStateType = ReturnType<typeof rootReducer>

export default store
