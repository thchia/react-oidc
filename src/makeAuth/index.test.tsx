import * as React from 'react'
import { fireEvent, render, waitForElement } from 'react-testing-library'

import { AuthenticatorContext, makeAuthenticator } from './'
import makeUserManager from '../makeUserManager'
import MockUserManager from '../utils/userManager'

describe('makeAuthenticator', () => {
  const Child = () => <div>Make Auth Child</div>
  const ChildProps = ({foo}) => <div>{foo}</div>
  const Placeholder = () => <div>Placeholder</div>
  const Logout = (props: { signOut: () => void }) => (
    <button onClick={props.signOut}>Logout</button>
  )
  const successfulGetUser = () => new Promise(res => res({ expired: false }))
  const expiredGetUser = () => new Promise(res => res({ expired: true }))
  const failedGetUser = () => new Promise((res, rej) => rej('Test Error'))

  it('renders children if user is authenticated', async () => {
    const userManagerConfig = {
      getUserFunction: successfulGetUser
    } as any

    const WithAuth = makeAuthenticator({
      userManager: makeUserManager(userManagerConfig, MockUserManager)
    })(Child)
    const { getByText } = render(<WithAuth />)

    await successfulGetUser
    getByText('Make Auth Child')
  })

  it('does not render authed children if user is not authenticated', async () => {
    const userManagerConfig = {
      getUserFunction: expiredGetUser
    } as any

    const WithAuth = makeAuthenticator({
      userManager: makeUserManager(userManagerConfig, MockUserManager),
      placeholderComponent: <Placeholder />
    })(Child)
    const { queryByText } = render(<WithAuth />)

    await expect(expiredGetUser()).resolves.toEqual({ expired: true })
    expect(queryByText('Make Auth Child')).toBeNull()
  })

  it('does not render authed children if there is an error retrieving user auth state', async () => {
    const userManagerConfig = {
      getUserFunction: failedGetUser
    } as any

    const WithAuth = makeAuthenticator({
      userManager: makeUserManager(userManagerConfig, MockUserManager),
      placeholderComponent: <Placeholder />
    })(Child)
    const { queryByText } = render(<WithAuth />)

    await expect(expiredGetUser()).resolves.toEqual({ expired: true })
    expect(queryByText('Make Auth Child')).toBeNull()
  })

  it('renders placeholder when getting user auth state', async () => {
    const userManagerConfig = {
      getUserFunction: successfulGetUser
    } as any

    const WithAuth = makeAuthenticator({
      userManager: makeUserManager(userManagerConfig, MockUserManager),
      placeholderComponent: <Placeholder />
    })(Child)
    const { getByText, queryByText } = render(<WithAuth />)

    getByText('Placeholder')
    await successfulGetUser
    getByText('Make Auth Child')
    expect(queryByText('Placeholder')).toBeNull()
  })

  it('signs out', async () => {
    const userManagerConfig = {
      getUserFunction: successfulGetUser
    } as any

    const SignOut = () => (<AuthenticatorContext.Consumer>{({ signOut }) => <Logout signOut={signOut} />}</AuthenticatorContext.Consumer>);
    const WithAuth = makeAuthenticator({
      userManager: makeUserManager(userManagerConfig, MockUserManager)
    })(SignOut)
    const { getByText, queryByText } = render(<WithAuth />)

    await successfulGetUser
    const button = getByText('Logout')

    fireEvent.click(button)
    waitForElement(() => expect(queryByText('Logout')).toBeNull())
  })
  
  it('has props passed through', async () => {
    const userManagerConfig = {
      getUserFunction: successfulGetUser
    } as any

    const WithAuth = makeAuthenticator({
      userManager: makeUserManager(userManagerConfig, MockUserManager),
      placeholderComponent: <Placeholder />
    })(ChildProps)
    const { getByText } = render(<WithAuth foo="bar" />)

    await successfulGetUser
    getByText('bar')
  })
})
