import * as React from 'react'
import { render, wait } from 'react-testing-library'

import RedirectToAuth from './'
import MockUserManager from '../utils/userManager'

describe('RedirectToAuth', () => {
  it('calls signinRedirect', () => {
    const mock = jest.fn()
    const um = new MockUserManager({ signinRedirectFunction: mock })
    render(<RedirectToAuth userManager={um} />)

    wait(() => expect(mock).toHaveBeenCalledTimes(1))
  })
})
