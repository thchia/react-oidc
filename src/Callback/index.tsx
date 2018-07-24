import * as React from 'react'
import { User, UserManager, UserManagerSettings } from 'oidc-client'

export interface ICallbackProps {
  onSuccess?: (user: User) => void
  onError?: (err: any) => void
  userManagerConfig: UserManagerSettings
  UserManager?: typeof UserManager
}
class Callback extends React.Component<ICallbackProps> {
  public componentDidMount() {
    const {
      onSuccess,
      onError,
      UserManager: userManager,
      userManagerConfig
    } = this.props
    if (userManagerConfig) {
      const UserManagerClass = userManager || UserManager
      const um = new UserManagerClass(userManagerConfig)
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
