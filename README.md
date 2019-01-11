# React OIDC

Wrapper for [oidc-client-js](https://github.com/IdentityModel/oidc-client-js), to be used in React apps.

**This is an alpha version**

## Quick start

> You should read the [slow start](https://github.com/thchia/react-oidc#slow-start) and [Routing Considerations](https://github.com/thchia/react-oidc#routing-considerations) too

```bash
yarn add react-oidc
```

You will need the [config](https://github.com/IdentityModel/oidc-client-js/wiki#configuration) for the `UserManager` class.

Example using `react-router`

```jsx
import {
  makeAuthenticator,
  makeUserManager,
  Callback,
  SignoutCallback
} from 'react-oidc'

// supply this yourself
import userManagerConfig from '../config'

const userManager = makeUserManager(userManagerConfig)
const AppWithAuth = makeAuthenticator({
  userManager
})(<App />)

export default () => (
  <Router>
    <Switch>
      <Route
        path="/callback"
        render={routeProps => (
          <Callback
            onSuccess={() => routeProps.history.push('/')}
            userManager={userManager}
          />
        )}
      />
      <Route
        path="/logout"
        render={routeProps => (
          <SignoutCallback
            onSuccess={() => routeProps.history.push('/')}
            userManager={userManager}
          />
        )}
      />
      <AppWithAuth />
    </Switch>
  </Router>
)
```

## Slow start

There are 4 main parts to this library:

- `makeUserManager` function;
- `makeAuthenticator` function;
- `Callback` component;
- `SignoutCallback` component

### `makeUserManager(config)`

| Param    | Type                           | Required | Default Value | Description                            |
| -------- | ------------------------------ | -------- | ------------- | -------------------------------------- |
| `config` | object (`UserManagerSettings`) | Yes      | `undefined`   | Config object to pass to `UserManager` |

Helper utility to create a `UserManager` instance.

### `makeAuthenticator(params)(<ProtectedApp />)`

| Param                  | Type          | Required | Default Value | Description                                                      |
| ---------------------- | ------------- | -------- | ------------- | ---------------------------------------------------------------- |
| `userManager`          | `UserManager` | Yes      | `undefined`   | `UserManager` instance (the result of `makeUserManager()`)       |
| `placeholderComponent` | Component     | No       | `null`        | Optional component to render while auth state is being retrieved |

This is a higher-order function that accepts a `UserManager` instance, and optionally a placeholder component to render when user auth state is being retrieved. It returns a function that accepts a React component. This component should contain all components that you want to be protected by your authentication. Ultimately you will get back a component that either renders the component you passed it (if the user is authenticated), or redirects to the OIDC login screen as defined by the Identity Provider.

The lifecycle of this component is as follows:

1.  The component is constructed with a fetching flag set to true.

2.  On mount, the `.getUser()` method from `UserManager` is called. If the user is already authenticated, it will set the fetching flag to false and render the component you passed it.

3.  If the user is not authenticated or their token has expired, the user will be redirected to the login URL (defined by the Identity Provider) and the fetching flag will be set to false.

4.  Upon successful authentication with the Identity Provider, the user will be redirected to the `redirect_uri`. You should render the `Callback` component at this location.

#### Note on the fetching flag

> The fetching flag is set to `true` initially because of the asynchronous nature of `.getUser()`. There is a need to ensure that we do not redirect to the login page whilst `getUser` is resolving. Without some way of knowing when the user auth state query is complete, we would end up **always** redirecting to the login page.

### `<Callback />`

| Prop          | Type          | Required | Default Value | Description                                                                                     |
| ------------- | ------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `userManager` | `UserManager` | Yes      | `undefined`   | `UserManager` instance (the result of `makeUserManager()`)                                      |
| `children`    | Component     | No       | null          | Optional component to render at the redirect page                                               |
| `onError`     | function      | No       | `undefined`   | Optional callback if there is an error from the Promise returned by `.signinRedirectCallback()` |
| `onSuccess`   | function      | No       | `undefined`   | Optional callback when the Promise from `.signinRedirectCallback()` resolves                    |

The `Callback` component will call the `.signinRedirectCallback()` method from `UserManager` and if successful, call the `onSuccess` prop. On error it will call the `onError` prop. You should pass the same instance of `UserManager` that you passed to `makeAuthenticator`.

### `<SignoutCallback />`

| Prop          | Type          | Required | Default Value | Description                                                                                      |
| ------------- | ------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `userManager` | `UserManager` | Yes      | `undefined`   | `UserManager` instance (the result of `makeUserManager()`)                                       |
| `children`    | Component     | No       | null          | Optional component to render at the redirect page                                                |
| `onError`     | function      | No       | `undefined`   | Optional callback if there is an error from the Promise returned by `.signoutRedirectCallback()` |
| `onSuccess`   | function      | No       | `undefined`   | Optional callback when the Promise from `.signoutRedirectCallback()` resolves                    |

The `SignoutCallback` component will call the `.signoutRedirectCallback()` method from `UserManager` and if successful, call the `onSuccess` prop. On error it will call the `onError` prop. You should pass the same instance of `UserManager` that you passed to `makeAuthenticator`.

### `<UserData />`

This component exposes the data of the authenticated user. If you are familiar with React's Context API (the official v16.3.x one), this component is just a `Context`.

```jsx
<UserData.Consumer>
  {context => <p>{context.user.id_token}</p>}
</UserData.Consumer>
```

Render prop function

| Argument (key of `context`) | Type          | Description                                  |
| --------------------------- | ------------- | -------------------------------------------- |
| `signOut`                   | function      | Call this to sign the current user out       |
| `user`                      | `User`        | This is the `User` object from `oidc-client` |
| `userManager`               | `UserManager` | `UserManager` instance from `oidc-client`    |

## Routing considerations

This library is deliberately unopinionated about routing, however there are restrictions from the `oidc-client` library that should be considered.

1.  **There will be url redirects**. It is highly recommended to use a routing library like `react-router` to help deal with this.

2.  **The `redirect_uri` should match eagerly (for both login and logout)**. You should not render the result of `makeAuthenticator()()` at the location of the `redirect_uri`. If you do, you will end up in a redirect loop that ultimately leads you back to the authentication page. In the quick start above, a `Switch` from `react-router` is used, and the `Callback` component is placed _before_ `AppWithAuth`. This ensures that when the user is redirected to the `redirect_uri`, `AppWithAuth` is not rendered. Once the user data has been loaded into storage, `onSuccess` is called and the user is redirected back to a protected route. When `AppWithAuth` loads now, the valid user session is in storage and the protected routes are rendered.
