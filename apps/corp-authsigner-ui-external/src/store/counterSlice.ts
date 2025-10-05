import { createSlice } from '@reduxjs/toolkit'
import { incrementValue, initialCounterState } from '@shared'

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  reducers: {
    increment: incrementValue,
    decrement(state) {
      state.value -= 1
    },
  },
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer
