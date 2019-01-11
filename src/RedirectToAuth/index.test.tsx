import * as React from 'react'
import { render, wait } from 'react-testing-library'

import RedirectToAuth from './'
import MockUserManager from '../utils/userManager'

describe('RedirectToAuth', () => {
  it('calls signinRedirect', () => {
    const mock = jest.fn()
    const um = new MockUserManager({ signinRedirectFunction: mock })
    render(<RedirectToAuth userManager={um} onSilentSuccess={jest.fn()} />)

    wait(() => expect(mock).toHaveBeenCalledTimes(1))
  })

  it('calls onSilentSuccess', () => {
    const mock = jest.fn()
    const onSilentSuccess = jest.fn()
    const um = new MockUserManager({
      signinRedirectFunction: mock,
      signinSilent: mock
    })
    render(
      <RedirectToAuth userManager={um} onSilentSuccess={onSilentSuccess} />
    )

    wait(() => expect(onSilentSuccess).toHaveBeenCalledTimes(1))
  })

  it('calls signinRedirect if signinSilent fails', () => {
    const mock = jest.fn()
    const onSilentSuccess = jest.fn(() => {
      throw new Error()
    })
    const um = new MockUserManager({
      signinRedirectFunction: mock,
      signinSilent: jest.fn()
    })
    render(
      <RedirectToAuth userManager={um} onSilentSuccess={onSilentSuccess} />
    )

    wait(() => expect(mock).toHaveBeenCalledTimes(1))
  })
})
