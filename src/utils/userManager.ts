import { UserManagerSettings } from 'oidc-client'

export interface IMockUserManagerOptions extends UserManagerSettings {
  signinRedirectCallback: Promise<any>
}
class UserManager {
  signinRedirectCallbackFunction: Promise<any>
  constructor(args: IMockUserManagerOptions) {
    this.signinRedirectCallbackFunction =
      args.signinRedirectCallback || new Promise(res => res())
  }
  signinRedirectCallback() {
    return this.signinRedirectCallbackFunction
  }
}

export default UserManager as any
