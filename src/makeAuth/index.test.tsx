import * as React from 'react'
import { render } from 'react-testing-library'

import { makeAuthenticator } from './'
import MockUserManager from '../utils/userManager'

describe('makeAuthenticator', () => {
  const Child = () => <div>Make Auth Child</div>
  const Placeholder = () => <div>Placeholder</div>
  const successfulGetUser = () => new Promise(res => res({ expired: false }))
  const expiredGetUser = () => new Promise(res => res({ expired: true }))
  const failedGetUser = () => new Promise((res, rej) => rej('Test Error'))

  it('renders children if user is authenticated', async () => {
    const userManagerConfig = {
      getUserFunction: successfulGetUser
    } as any

    const WithAuth = makeAuthenticator({
      injectedUM: MockUserManager,
      userManagerConfig
    })(<Child />)
    const { getByText } = render(<WithAuth />)

    await successfulGetUser
    getByText('Make Auth Child')
  })

  it('does not render children if user is not authenticated', async () => {
    const userManagerConfig = {
      getUserFunction: expiredGetUser
    } as any

    const WithAuth = makeAuthenticator({
      injectedUM: MockUserManager,
      placeholderComponent: <Placeholder />,
      userManagerConfig
    })(<Child />)
    const { queryByText } = render(<WithAuth />)

    await expect(expiredGetUser()).resolves.toEqual({ expired: true })
    expect(queryByText('Make Auth Child')).toBeNull()
    expect(queryByText('Placeholder')).toBeNull()
  })

  it('does not render children if there is an error retrieving user auth state', async () => {
    const userManagerConfig = {
      getUserFunction: failedGetUser
    } as any

    const WithAuth = makeAuthenticator({
      injectedUM: MockUserManager,
      placeholderComponent: <Placeholder />,
      userManagerConfig
    })(<Child />)
    const { queryByText } = render(<WithAuth />)

    await expect(expiredGetUser()).resolves.toEqual({ expired: true })
    expect(queryByText('Make Auth Child')).toBeNull()
    expect(queryByText('Placeholder')).toBeNull()
  })

  it('renders placeholder when getting user auth state', async () => {
    const userManagerConfig = {
      getUserFunction: successfulGetUser
    } as any

    const WithAuth = makeAuthenticator({
      injectedUM: MockUserManager,
      placeholderComponent: <Placeholder />,
      userManagerConfig
    })(<Child />)
    const { getByText, queryByText } = render(<WithAuth />)

    getByText('Placeholder')
    await successfulGetUser
    getByText('Make Auth Child')
    expect(queryByText('Placeholder')).toBeNull()
  })
})
