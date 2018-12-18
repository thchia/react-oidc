import * as React from 'react'
import { User, UserManager, UserManagerSettings } from 'oidc-client'

export interface ICallbackProps {
  onSuccess?: (user: User) => void
  onError?: (err: any) => void
  userManager: UserManager
}
class Callback extends React.Component<ICallbackProps> {
  public componentDidMount() {
    const { onSuccess, onError, userManager } = this.props

    const um = userManager
    um.signinRedirectCallback()
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
