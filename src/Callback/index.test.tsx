import * as React from 'react'
import { render, wait } from 'react-testing-library'

import Callback from './'

const makeMockedPromise = (params?: {
  result?: 'resolve' | 'reject'
  payload?: any
}) => {
  if (!params)
    params = {
      result: 'resolve',
      payload: undefined
    }
  if (params.result === 'resolve') {
    return jest.fn(() => Promise.resolve(params.payload))
  } else {
    return jest.fn(() => Promise.reject(params.payload))
  }
}

describe('Callback component', () => {
  it('calls onSuccess', () => {
    const onSuccess = jest.fn()

    render(
      <Callback
        redirectCallback={makeMockedPromise({ payload: 'mockUser' })}
        onSuccess={onSuccess}
      >
        <div />
      </Callback>
    )

    wait(() => expect(onSuccess).toHaveBeenCalledWith('mockUser'))
  })

  it('calls on Error', () => {
    const onError = jest.fn()

    render(
      <Callback
        redirectCallback={makeMockedPromise({ payload: 'Test Error' })}
        onError={onError}
      >
        <div />
      </Callback>
    )

    wait(() => expect(onError).toHaveBeenCalledWith('Test Error'))
  })

  it('renders children', () => {
    const { getByText } = render(
      <Callback redirectCallback={makeMockedPromise()}>
        <div>Test Child</div>
      </Callback>
    )

    getByText('Test Child')
  })

  it('works without children', () => {
    render(<Callback redirectCallback={makeMockedPromise()} />)
  })
})
