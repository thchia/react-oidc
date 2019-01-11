import * as React from 'react'

import Callback, { ICallbackActionProps } from '../Callback'

const SignOutCallback = (props: ICallbackActionProps) => {
  return (
    <Callback
      onSuccess={props.onSuccess}
      onError={props.onError}
      redirectCallback={props.userManager.signoutRedirectCallback}
    />
  )
}

export default SignOutCallback
