import * as React from 'react'
import { User, UserManager } from 'oidc-client'

export interface ICallbackHandlers {
  onSuccess?: (user: User) => void
  onError?: (err: any) => void
}
export interface IRedirectCallback {
  redirectCallback:
    | UserManager['signinRedirectCallback']
    | UserManager['signoutRedirectCallback']
}
export type ICallbackProps = ICallbackHandlers & IRedirectCallback
export type ICallbackActionProps = ICallbackHandlers & {
  userManager: UserManager
}

class Callback extends React.Component<ICallbackProps> {
  public componentDidMount() {
    const { onSuccess, onError, redirectCallback } = this.props

    redirectCallback()
      .then(user => {
        if (onSuccess) {
          onSuccess(user)
        }
      })
      .catch(err => {
        if (onError) {
          onError(err)
        }
      })
  }
  public render() {
    return this.props.children || null
  }
}

export default Callback
