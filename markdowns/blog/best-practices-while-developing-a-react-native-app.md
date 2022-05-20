This post was originally published in the thoughtbot blog, [Giant Robots
Smashing Into Other Giant Robots].

[Giant Robots Smashing Into Other Giant Robots]:https://thoughtbot.com/blog/best-practices-while-developing-a-react-native-app

It has been close to 5 years since React Native (RN) was publicly released. It
is estimated that 8% of the Apps on App Store are developed with React Native,
and Microsoft has around 38 Apps built with the same across iOS and Android.
Going by Google trends, it seems to be as popular and growing faster than ever.
We all know that React Native is built on JavaScript, which is one of the most
popular languages. Like any other JavaScript-based library, there seems to be no
definite way of writing code, and multiple opinions are always around. RN comes
in 2 flavors - An Expokit based App or a traditional RN App. The guidelines
mentioned below would work irrespective of the flavor of React Native you choose
to utilize.

Components are the building blocks of any React App, and the introduction of the
hooks API didn't make it any easier as it introduced additional complexities
into the way we write our components. The following points might help you
organize your App code better.

## Divide the components

Divide your React components into two directories - `components` and
`containers`. You can name them differently as per your choice.
`containers` are directories which follow these rules:

- Do not import anything from react-native (View, Text, etc.) that build your
  JSX components.
- The imports to your Higher-Order Components connecting to the redux store (if
  your project uses redux which we recommend) and their respective connections.
  This means the redux hooks (useDispatch, useSelector, etc.), redux actions,
  redux selectors (extract useful data for the container from App state) must
  live here.
- Other possible imports could be react-navigation related integrations and
  possibly a unique library you use for your project which could be put here.

```javascript

// containers
import React from 'react'
import type { Element } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavigationScreenProp } from 'react-navigation'
import I18n from 'react-native-i18n'
import { Formik } from 'formik'
import { registerProcess } from 'actions'
import { authenticationSelector, ordersLoading } from 'selectors'

```

`components` are directories which follow these rules:

- components are children of a container and they would receive the App state
  data as props which would be used to construct the UI. You must place all the
  JSX code of your React components along with their respective react-native
  imports here.
- You would also utilise the react hooks (useEffect, useRef, useState) at the
  component level which should mostly be avoided in a container.
- Other possible imports would be types, styles, other components for code
  re-use, and in general anything else which a container does not do.

```javascript

// components
import React, { useRef, useState } from 'react'
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import { ArrowIcon } from 'components/icons'
import NutritionDetails from './NutritionDetails'
import type { NutritionalInfoType } from 'types/product'
import { nutritionalInfoStyles as styles } from './styles'

```

These are not hard-and-fast rules and you are encouraged to make exceptions or
change them. We found that this helped us write clean code that is highly
readable.

## Create Aliases

Create aliases using [babel-plugin-module-resolver] to avoid nested imports such
as `import Product from '../../../Components/Product'`. Aliases created
using babel-plugin-module-resolver look something like this.

```javascript

alias: {
          actions: './app/actions',
          api: './app/api',
          assets: './app/assets',
          components: './app/components',
          containers: './app/containers',
          constants: './app/constants',
          sagas: './app/sagas',
          selectors: './app/selectors',
          types: './app/types',
          utils: './app/utils',
        }

  ```

You can use imports like `import Product from 'components/Product'` after
setting it up.

[babel-plugin-module-resolver]:
https://github.com/tleunen/babel-plugin-module-resolver

## Sort the imports

Divide your imports and sort them logically unless it is not possible due to the
use of aliases. There is no hard rule with the order in which you sort them, but
at least categorizing them into two categories such as library imports and all
other imports would be easier for someone reviewing your code.

```javascript

import React, { useState } from 'react'
import type { Element } from 'react'
import { View, ScrollView } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { useSelector } from 'react-redux'
import type { OrderType, LineItemWithProdType } from 'types'
import { ordersByIdSelector, productsByIdSelector } from 'selectors'
import { OrderTicket, OrderDetails } from 'components/Order'
import { DefaultStatusBar, RedStatusBar } from 'components/StatusBar'
import { orderStyles as styles } from './styles'

```

## Declare the types

Be it TypeScript or Flow, it is essential to declare the types of every object
in the code. This includes declaring the return type and argument type.

```javascript

const payload: LoginUserType = {
  email: 'name@example.com',
  password: 'password',
}
const roundDistance = (distance: number): string => (distance / 1000).
toFixed(1)

```

For Flow-based projects, remember to add the `// @flow` at the start of
every new file you create in the project.

Sometimes it might be tempting to declare types (objects, props, state) inside
each component (file). This invites trouble in the future if left unorganized
into a separate `types` directory in a logical order based on the
requirements of your project. Ensure the types created are reused across the
code following the DRY principles to get the full benefits of type checking.

Also remember to use the `|` symbol to create Exact object types for even
stronger type safety. This ensures new keys cannot be added to an object.

```javascript

type LoginUserType = {|
  email: string,
  password: string,
|}

```

## Separate the styles

The thoughtbot [React Native style guide] is an excellent article that covers
all the styling requirements of a project. In short, we suggest you keep the
styles away from your React components so that concerns are separated. It also
is easy on the eyes of the reviewer and makes the code cleaner.

```javascript

import { productAmountstyles as styles } from './styles'
...
<View style={styles.container}>
  <Text style={styles.amountText}>{I18n.t('itemScreen.amount')}</Text>
  <View style={styles.quantityContainer}>
    <CircularButton disabled={quantity === 1} onPress={onReduce} />
    <View style={styles.quantityTextContainer}>
      <Text style={styles.quantityText}>{quantity}</Text>
    </View>
    <CircularButton disabled={false} add onPress={onAdd} />
  </View>
</View>

```

[React Native style guide]:
https://thoughtbot.com/blog/structure-for-styling-in-react-native

## Components must hook

It is 2020 and you should be using `Hooks!` There are plenty of reasons for
this: Hooks are declarative, easier to read and understand, and they reduce a
lot of `this.x, this.y and this.setState()` in your code. We didn't have a
need to use a Class-based component, which a Functional component using Hooks
wouldn't solve.

```javascript

const [showModal, setShowModal] = useState(true)
...
useEffect(() => {
  dispatch(doFetchOrders())
  dispatch(doFetchProducts())
}, [dispatch])
...
const authenticationData: AuthenticationStateType = useSelector
(authenticationSelector)
...
const mapViewRef: { current: MapView } = useRef(null)

```

## Let Redux manage

React has evolved to coexist with multiple state management libraries and has
now come to a point where teams are finding redux to be cumbersome and overkill.
Unless your team is using GraphQL or its variants which doesn't need a state
management library for the front-end, We find redux to be still useful and has a
predictable way to handle the App state in our projects. You could always spice
it up with [Immer] to gain mutating capabilities. We also suggest setting up
[React Native debugger], which is packed with a lot of useful features such as
viewing the entire App state tree (giant JavaScript object), firing redux
actions on the fly to see it reflect on the App UI and so on.

[React Native debugger]: https://github.com/jhen0409/react-native-debugger
[Immer]: https://github.com/immerjs/immer

## Write sagas for asynchrony

If the above point was not convincing enough, consider the advantages of using
redux for its middleware capabilities that integrate well with a library like
redux-saga. `redux-saga` helps you handle the App side effects (asynchronous
logic such as API calls, Navigation to another screen, etc.) and makes them
easier to code and manage.

```javascript

export function* loginProcess({
  payload: session }) {
  const { login } = url
  yield put(doAuthenticateUserStart())
  const data = yield call(makeApiCall, login, { session })
  if (data.message || data.errors) {
    yield put(doLoginUserError(data))
  } else if (data) {
    yield put(doLoginUserDone(data))
    yield call(continueOrderingProcess)
  }
}

```

We also like `axios` to handle our API calls, and there are some advantages
of using it over a library like `fetch` due to its more granular error
handling.

## Aggregate the selectors

It is often convenient to put the logic of extracting useful data from the App
state (predominantly using mapStateToProps in Class-based components) as
separate functions in each component. This would quickly lead to duplication of
state selection code across multiple components violating DRY principles. We
suggest putting it all together in one place into a `selectors` directory so
that these individual functions can be reused across components. We also
encourage developers to go one step further and use the `reselect` library,
which comes with caching and memoization benefits resulting in efficient
computation of derived data.

```javascript

export const productsSelector = state => state.menuItems.products.map(({ 
  product }) => product)

export const productsByIdSelector = createSelector(
  productsSelector,
  (products) => products.reduce((prodObj, product) => (
    prodObj[product.id] = product), {}),
)
...
const productsById = useSelector(productsByIdSelector)

```

## Jest test them

TDD and writing clear tests are important, and lead to fewer future bugs.
Different parts of React Native Apps can be tested in different ways, and we
suggest that every App should implement at least the Snapshot tests and Redux
tests (actions, reducers, sagas, and selectors).

Snapshot tests ensure that the components do not break and also assists the
developer to have an overview of the UI changes introduced by their code.

```javascript

it('renders ArrowIcon', () => {
  const component = renderer.create(<ArrowIcon />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

```

Redux tests are better and ensure the state of the App changes in a predictable
manner with the current code. This is where you should aim for 100% code
coverage, and it is advantageous to use redux due to its architecture, and the
tests are specific.

```javascript

// actions
it('gets all products', () => {
  const action = doFetchProducts()
  const expectedAction = { type: 'PRODUCTS_FETCH' }
  expect(action).toEqual(expectedAction)
})

// reducers
it('should handle FORGOT_PASSWORD_DONE', () => {
  const forgotPasswordDone = {
    type: FORGOT_PASSWORD_DONE,
    payload: {
      email: 'name@example.com',
    },
  }
  Object.freeze(beforeForgotPasswordDone)
  const newStateAfterForgotPassword = authReducer(beforeForgotPasswordDone, 
  forgotPasswordDone)
  expect(newStateAfterForgotPassword).toEqual(afterForgotPasswordDone)
})

// selectors
it('productsByIdSelector should return all the products by Id', () => {
  expect(productsByIdSelector(mockedState)).toEqual(productsById)
})

```

## Conclusion

The above set of constraints and best practices give us a predictable
development experience and accelerate our time to deliver. At the least, We
believe this could act as a starter to further evolve into better practices
while developing an Application using React Native.
