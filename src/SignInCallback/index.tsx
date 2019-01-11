import * as React from 'react'

import Callback, { ICallbackActionProps } from '../Callback'

const SignInCallback = (props: ICallbackActionProps) => {
  return (
    <Callback
      onSuccess={props.onSuccess}
      onError={props.onError}
      redirectCallback={props.userManager.signinRedirectCallback}
    />
  )
}

export default SignInCallback
