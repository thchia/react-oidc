# React OIDC

Wrapper for [oidc-client-js](https://github.com/IdentityModel/oidc-client-js), to be used in React apps.

## Quick start

> You should read the slow start too

```bash
yarn add react-oidc
```

You will need the [config](https://github.com/IdentityModel/oidc-client-js/wiki#configuration) for the `UserManager` class.

Example using `react-router`

```jsx
import { makeAuthenticator, Callback } from 'react-oidc'

const AppWithAuth = makeAuthenticator({
  config: userManagerConfig
})(<App />)

export default () => (
  <Router>
    <Switch>
      <Route
        path="/callback"
        render={routeProps => (
          <Callback
            onSuccess={() => routeProps.history.push('/')}
            userManagerConfig={userManagerConfig}
          />
        )}
      />
      <AppWithAuth />
    </Switch>
  </Router>
)
```

## Slow start

There are 2 main parts to this library:

- `makeAuthenticator` function;
- `Callback` component

### `makeAuthenticator`

`makeAuthenticator(params)(<ProtectedApp />)`

| param                  | type      | required | default value |
| ---------------------- | --------- | -------- | ------------- |
| `userManagerConfig`    | object    | Yes      | `undefined`   |
| `placeholderComponent` | Component | No       | `null`        |

This is a higher-order function that accepts a config object for the `UserManager` class provided by `oidc-client`, and optionally a placeholder component to render when user auth state is being retrieved. It returns a function that accepts a React component. This component should contain all components that you want to be protected by your authentication. Ultimately you will get back a component that either renders the component you passed it (if the user is authenticated), or redirects to the OIDC login screen as defined in the config.

The lifecycle of this component is as follows:

1.  The component is constructed with a fetching flag set to true.

2.  On mount, the `.getUser()` method from `UserManager` is called. If the user is already authenticated, it will set the fetching to false and render the component you passed it.

3.  If the user is not authenticated or their token has expired, the user will be redirected to the login URL (set by the Identity Provider).

4.  Upon successful authentication with the Identity Provider, the user will be redirected to the `redirect_uri`. You should render the `Callback` component at this location.

### `<Callback />`

| prop                | type     | required | default value |
| ------------------- | -------- | -------- | ------------- |
| `userManagerConfig` | object   | Yes      | `undefined`   |
| `onError`           | function | No       | `undefined`   |
| `onSuccess`         | function | No       | `undefined`   |

The `Callback` component will call the `.signinRedirectCallback()` method from `UserManager` and if successful, call the `onSuccess` prop. On error it will call the `onError` prop.

## Routing considerations

This library is deliberately unopinionated about routing, however there are restrictions from the `oidc-client` library that should be considered.

1.  **There will be url redirects**. It is highly recommended to use a routing library like `react-router` to help deal with this.

2.  **The `redirect_uri` should match eagerly**. You should not render the result of `makeAuthenticator()()` at the location of the `redirect_uri`. If you do, you will end up in a redirect loop that ultimately leads you back to the authentication page. In the quick start above, a `Switch` from `react-router` is used, and the `Callback` component is placed _before_ `AppWithAuth`. This ensures that when the user is redirected to the `redirect_uri`, `AppWithAuth` is not rendered. Once the user data has been loaded into storage, `onSuccess` is called and the user is redirected back to a protected route. When `AppWithAuth` loads now, the valid user session is in storage and the protected routes are rendered.
