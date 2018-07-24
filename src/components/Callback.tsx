import * as React from 'react'
import { User, UserManager, UserManagerSettings } from 'oidc-client'

export interface ICallbackProps {
  onSuccess?: (user: User) => void
  onError?: (err: any) => void
  userManagerConfig: UserManagerSettings
}
class Callback extends React.Component<ICallbackProps> {
  public componentDidMount() {
    const { onSuccess, onError, userManagerConfig } = this.props
    if (userManagerConfig) {
      const um = new UserManager(userManagerConfig)
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
  }
  public render() {
    return this.props.children
  }
}

export default Callback
