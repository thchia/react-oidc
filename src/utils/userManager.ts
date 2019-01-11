import { UserManagerSettings } from 'oidc-client'

export interface IOverloads {
  getUserFunction: () => Promise<any>
  signinRedirectCallback: () => Promise<any>
  signinRedirectFunction: () => void
  signoutRedirectFunction: () => void
  signinSilent?: () => void
}
export interface IMockUserManagerOptions
  extends UserManagerSettings,
    IOverloads {}
class UserManager implements IOverloads {
  getUserFunction: () => Promise<any>
  signinRedirectCallbackFunction: () => Promise<any>
  signinRedirectFunction: () => void
  signoutRedirectFunction: () => void
  signinSilent?: () => void

  constructor(args: IMockUserManagerOptions) {
    this.getUserFunction = args.getUserFunction
    this.signinRedirectFunction = args.signinRedirectFunction
    this.signinRedirectCallbackFunction = args.signinRedirectCallback
    this.signoutRedirectFunction = args.signoutRedirectFunction
    this.signinSilent = args.signinSilent
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
      : undefined
  }
}

export default UserManager as any
