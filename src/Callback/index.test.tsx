import * as React from 'react'
import { render } from 'react-testing-library'

import Callback from './'
import MockUserManager from '../utils/userManager'
import makeUserManager from '../makeUserManager'

const USER_MANAGER_CONFIG = {} as any

describe('Callback component', () => {
  it('calls onSuccess', async () => {
    const signinPromise = () => new Promise(res => res('mockUser'))
    const onSuccess = jest.fn()

    render(
      <Callback
        userManager={makeUserManager(
          {
            ...USER_MANAGER_CONFIG,
            signinRedirectCallback: signinPromise
          },
          MockUserManager
        )}
        onSuccess={onSuccess}
      >
        <div />
      </Callback>
    )

    await signinPromise
    expect(onSuccess).toHaveBeenCalledWith('mockUser')
  })

  it('calls on Error', async () => {
    const signinPromise = () => new Promise((res, rej) => rej('Test Error'))
    const onError = jest.fn()

    render(
      <Callback
        userManager={makeUserManager(
          {
            ...USER_MANAGER_CONFIG,
            signinRedirectCallback: signinPromise
          },
          MockUserManager
        )}
        onError={onError}
      >
        <div />
      </Callback>
    )

    try {
      await signinPromise
    } catch (e) {
      expect(onError).toHaveBeenCalledWith('Test Error')
    }
  })

  it('renders children', () => {
    const { getByText } = render(
      <Callback
        userManager={makeUserManager(USER_MANAGER_CONFIG, MockUserManager)}
      >
        <div>Test Child</div>
      </Callback>
    )

    getByText('Test Child')
  })

  it('works without children', () => {
    render(
      <Callback
        userManager={makeUserManager(USER_MANAGER_CONFIG, MockUserManager)}
      />
    )
  })
})
