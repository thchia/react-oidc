import { UserManagerSettings } from 'oidc-client'

export interface IMockUserManagerOptions extends UserManagerSettings {
  getUserFunction: () => Promise<any>
  signinRedirectCallback: () => Promise<any>
  signinRedirectFunction: () => void
  signoutRedirectFunction: () => void
  signoutRedirectCallback: () => Promise<any>
}
class UserManager {
  getUserFunction: () => Promise<any>
  signinRedirectCallbackFunction: () => Promise<any>
  signinRedirectFunction: () => void
  signoutRedirectFunction: () => void
  signoutRedirectCallbackFunction: () => Promise<any>

  constructor(args: IMockUserManagerOptions) {
    this.getUserFunction = args.getUserFunction
    this.signinRedirectFunction = args.signinRedirectFunction
    this.signinRedirectCallbackFunction = args.signinRedirectCallback
    this.signoutRedirectFunction = args.signoutRedirectFunction
    this.signoutRedirectCallbackFunction = args.signoutRedirectCallback
  }

  getUser() {
    return this.getUserFunction() || new Promise(res => res())
  }
  removeUser() {
    this.getUser = () => new Promise(res => res(null))
  }
  signinRedirect(): void {
    return this.signinRedirectFunction
      ? this.signinRedirectFunction()
      : undefined
  }
  signinRedirectCallback() {
    return this.signinRedirectCallbackFunction
      ? this.signinRedirectCallbackFunction()
      : new Promise(res => res())
  }

  signoutRedirect(): void {
    return this.signoutRedirectFunction
      ? this.signoutRedirectFunction()
      : undefined;
  }
  signoutRedirectCallback() {
    return this.signoutRedirectCallbackFunction
      ? this.signoutRedirectCallbackFunction()
      : undefined;
  }
}

export default UserManager as any
