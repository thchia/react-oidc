import * as React from 'react'
import { UserManager, User } from 'oidc-client'

export interface IRedirectToAuthProps {
  userManager: UserManager
  onSilentSuccess: (user: User) => void
}
class RedirectToAuth extends React.Component<IRedirectToAuthProps> {
  public async componentDidMount() {
    if (this.props.userManager.signinSilent) {
      try {
        const user = await this.props.userManager.signinSilent()
        this.props.onSilentSuccess(user)
      } catch (e) {
        this.props.userManager.signinRedirect()
      }
    } else {
      this.props.userManager.signinRedirect()
    }
  }
  public render() {
    return this.props.children || null
  }
}

export default RedirectToAuth
