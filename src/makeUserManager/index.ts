import { UserManager, UserManagerSettings } from 'oidc-client'

function makeUserManager(
  config: UserManagerSettings & { domain?: string; audience?: string },
  umClass?: any
): UserManager {
  const UMClass = umClass || UserManager
  return new UMClass(config)
}

export default makeUserManager
