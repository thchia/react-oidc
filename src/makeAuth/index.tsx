import * as React from 'react'
import { User, UserManager, UserManagerSettings } from 'oidc-client'

import RedirectToAuth from '../RedirectToAuth'

export interface IAuthenticatorContext {
  signOut: () => void
  user: User | null
  userManager: UserManager | null
}
const DEFAULT_CONTEXT: IAuthenticatorContext = {
  signOut: () => {},
  user: null,
  userManager: null
}
const { Consumer, Provider } = React.createContext<IAuthenticatorContext>(
  DEFAULT_CONTEXT
)

export interface IAuthenticatorState {
  isFetchingUser: boolean
  context: {
    signOut: () => void
    user: User | null
    userManager: UserManager
  }
}
export interface IMakeAuthenticatorParams {
  placeholderComponent?: React.ReactNode
  userManager?: UserManager
}
function makeAuthenticator({
  userManager,
  placeholderComponent
}: IMakeAuthenticatorParams) {
  return <Props extends {}>(WrappedComponent: React.ReactNode) => {
    return class Authenticator extends React.Component<
      Props,
      IAuthenticatorState
    > {
      public userManager: UserManager
      constructor(props: Props) {
        super(props)
        const um = userManager
        this.userManager = um
        this.state = {
          context: {
            signOut: this.signOut,
            user: null,
            userManager: um
          },
          isFetchingUser: true
        }
      }

      public componentDidMount() {
        this.getUser()
      }

      public getUser = () => {
        this.userManager
          .getUser()
          .then(user => this.storeUser(user))
          .catch(() => this.setState({ isFetchingUser: false }))
      }

      public storeUser = (user: User) => {
        if (user) {
          this.setState(({ context }) => ({
            context: { ...context, user },
            isFetchingUser: false
          }))
        } else {
          this.setState(({ context }) => ({
            context: { ...context, user: null },
            isFetchingUser: false
          }))
        }
      }

      public signOut = () => {
        this.userManager.removeUser()
        this.getUser()
      }

      public isValid = () => {
        const { user } = this.state.context
        return !!(user && !user.expired)
      }

      public render() {
        if (this.state.isFetchingUser) {
          return placeholderComponent || null
        }
        return this.isValid() ? (
          <Provider value={this.state.context}>{WrappedComponent}</Provider>
        ) : (
          <RedirectToAuth
            userManager={this.userManager}
            onSilentSuccess={this.storeUser}
          />
        )
      }
    }
  }
}
export { Consumer, makeAuthenticator }
