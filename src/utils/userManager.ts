import { UserManagerSettings } from 'oidc-client'

export interface IMockUserManagerOptions extends UserManagerSettings {
  getUserFunction: () => Promise<any>
  signinRedirectCallback: () => Promise<any>
  signinRedirectFunction: () => void
}
class UserManager {
  getUserFunction: () => Promise<any>
  signinRedirectCallbackFunction: () => Promise<any>
  signinRedirectFunction: () => void

  constructor(args: IMockUserManagerOptions) {
    this.getUserFunction = args.getUserFunction
    this.signinRedirectFunction = args.signinRedirectFunction
    this.signinRedirectCallbackFunction = args.signinRedirectCallback
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
}

export default UserManager as any
