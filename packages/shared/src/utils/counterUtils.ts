export interface CounterState {
  value: number
}

export const initialCounterState: CounterState = {
  value: 0,
}

export const incrementValue = (state: CounterState) => {
  state.value += 1
}
