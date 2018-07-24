import * as React from 'react'
import { User, UserManager } from 'oidc-client'

export interface ICallbackProps {
  onSuccess?: (user: User) => void
  onError?: (err: any) => void
  userManagerInstance: UserManager
}
class Callback extends React.Component<ICallbackProps> {
  public componentDidMount() {
    const { onSuccess, onError, userManagerInstance } = this.props
    if (userManagerInstance) {
      userManagerInstance
        .signinRedirectCallback()
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
