import * as React from 'react'
import { UserManager, User } from 'oidc-client'

export interface IRedirectToAuthProps {
  userManager: UserManager
  onSilentSuccess: (user: User) => void
  signinArgs?: any
}
class RedirectToAuth extends React.Component<IRedirectToAuthProps> {
  public async componentDidMount() {
    const user = await this.props.userManager.getUser();
    const requiresSignIn = !user || user.expired;

    if (requiresSignIn) {
      this.redirectToSignIn();
    } else {
      await this.silentlySignIn();
    }
  }

  public render() {
    return this.props.children || null
  }

  private redirectToSignIn() {
    this.props.userManager.signinRedirect(this.props.signinArgs);
  }

  private async silentlySignIn(){
    try {
      const user = await this.props.userManager.signinSilent(this.props.signinArgs);
      this.props.onSilentSuccess(user);
    } catch (e) {
      this.props.userManager.signinRedirect(this.props.signinArgs);
    }
  }
}

export default RedirectToAuth
