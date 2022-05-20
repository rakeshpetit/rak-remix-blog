This post was originally published in the thoughtbot blog, [Giant Robots
Smashing Into Other Giant Robots].

[Giant Robots Smashing Into Other Giant Robots]:https://thoughtbot.com/blog/flow-control-in-react-navigation

For React Native, we have had multiple navigation solutions over the years. At some point, [react-native-navigation] seemed like a competitive alternative with a 100% native navigation solution compared to the erstwhile [react-navigation], which still was using the only JavaScript thread available for the App. Saddled with bugs and unclear documentation, "react-native-navigation" failed to attract developers. In contrast, "react-navigation" with top-class documentation and active development stood out and established itself as the de facto standard with wide adoption in the industry. Even the official react-native docs seem to [accept] this. This post's goal is to offer a solution using which developers can better control their App navigation and assumes react-navigation is being used in the project for transitioning between screens.

[accept]: https://reactnative.dev/docs/navigation
[react-navigation]: https://reactnavigation.org/ 
[react-native-navigation]: https://github.com/wix/react-native-navigation

Consider a common navigation scenario, such as the one below:

The user viewing the available items (say Grocery or Food) on the “Home” screen, selects a few of them and confirms for “Checkout.” But you need to perform specific validations and ensure you have all the data you need to check out.

![Navigation flow](https://images.thoughtbot.com/blog-vellum-image-uploads/BBD460hZTRO3EyijCh2a_navigation-flow.png)

1. You want to ensure the user is registered and authenticated in the system. If not, navigate the user to the "Authentication" screen or stack.
2. You want to ensure you save the address/location of the user in the system before checkout. If not, navigate the user to the "Location" screen.

The "Checkout" screen with all the purchase options would be shown only after obtaining all the required information (registered user, location) of the user.

Consider another scenario: 

You are developing a real-time multi-player online quiz app where each user would take part in a contest trying to answer a series of questions. Let us say there are multiple rounds in the contest and at the end of each round you would like to eliminate participants based on their performance. The elimination process could either be based on an API call for each question or have the entire collection of solutions loaded before starting the quiz. We would have navigation complications such as:

1. Wait until all the participants have answered their question before navigating to the screen showing the next question to ensure fair play. 
2. Possibly steer the users who have already answered their question to a different screen and engage them with different content (advertisement) while they wait and eventually navigate them to the next question.
3. Navigate a group of the winners of a round to another screen with a different set of UI controls (say round two).
4. Navigate the participants that were eliminated to another screen, informing them about their elimination.
5. Finally, navigate to a "tie-breaker" screen as the last round with timed controls to respond to questions.

You might argue that you are a React ninja who can handle these complexities in the same screen/component and do not need these many screens for this scenario, rendering this post moot. If you are not that person, you can clearly understand that situations can quickly start getting complicated, and it is crucial to stay in control of where you would navigate your users.

## Navigation Service

To better control the navigation, we create a Navigation Service and expose the selected few methods (say [stack actions] such as push, pop, replace, etc.) we require in our App to be called asynchronously.

```
// navigationService.js
import { NavigationActions, StackActions } from 'react-navigation'

...

export default function navigate(routeName, params) {
  const action = NavigationActions.navigate({ routeName, params })
  dispatchAction(action)
}

export default function push(routeName, params) {
  const action = StackActions.push({ routeName, params })
  dispatchAction(action)
}

export default function pop() {
  const action = StackActions.pop()
  dispatchAction(action)
}
```

What is ```dispatchAction``` and how do we dispatch the ```navigate``` action ?

```
...

const config = {}
export function setNavigator(nav) {
  if (nav) {
    config.navigator = nav
  }
}

function dispatchAction(action) {
  if (config.navigator) {
    config.navigator.dispatch(action)
  }
}

...

```

We rely on the the setup functions such as ```setNavigator``` and ```dispatchAction``` to interact with react-navigation using [NavigationActions] such as navigate, pop, push, etc. we created initially. For that, we also need to populate the ```config.navigator``` with the actual navigator reference by calling the ```setNavigator``` method.

[stack actions]: https://reactnavigation.org/docs/4.x/stack-actions
[NavigationActions]: https://reactnavigation.org/docs/4.x/navigation-actions

## Navigator setup

Every App that uses react-navigation would have an App container created using ```createAppContainer``` with a root navigator (Stack, Drawer, Switch, etc).

```
const RootContainer = createAppContainer(rootStack)

...

<RootContainer ref={nav => setNavigator(nav)} />

...
```

The reference to the navigator obtained is used to call the ```setNavigator``` method which was exposed by our ```navigationService``` earlier. This ensures the navigator reference is rightly set so that we can start dispatching those actions.

## Transitioning between screens

As mentioned in our [best practices] guide, using a middleware such as redux-saga or redux-thunk comes with extensive benefits to control the asynchronous side effects. Most projects are set up with one of these middlewares. Consider our first scenario where we needed to conditionally navigate the users to one of "Authentication," "Location," or "Checkout" screens. Let us see how we achieve that using a saga function.

```
const isDeliverable = yield select(getIfDeliverable)
const location = yield select(getDeliveryLocation)
const isLoggedIn = yield select(isUserAuthenticated)
const lineItems = yield select(getBasketItems)

if (isDeliverable && location) {
  if (isLoggedIn && lineItems.length > 0) {
    yield fork(navigate, 'Checkout')
  } else {
    yield fork(navigate, 'Login'),
  }
} else {
  yield fork(navigate, 'Location')
}

```

The parameters such as ```isLoggedIn```, ```location```, etc. could either be the result of an API call or remain in the App state. Recall how we had exposed the ```navigate``` function in the ```navigationService``` earlier. 

Even if a middleware is not implemented in the project, we can use the ```navigationService``` by calling the respective functions.

```
navigate('Checkout')
...
push('Location')
```

[best practices]: https://thoughtbot.com/blog/best-practices-while-developing-a-react-native-app

## Passing conditional parameters

Apart from logical navigation between screens, we can also pass a different set of parameters for the destination screen. Observe an example where we navigate to an "EditItem" screen and pass different navigation parameters. Usually cluttered in a React component, this can conveniently be written in a separate testable function.

```
  if (isLoggedIn && lineItems.length > 0) {
    const unavailableItem = lineItems.find(
      item => item.status === 'UNAVAILABLE',
    )

    if (unavailableItem) {
      yield fork(
        navigate,
        'EditItem',
        {
          item: unavailableItem,
          error: 'removeItem',
        },
      )
    } else {
      yield fork(navigate, 'Checkout')
    }
  }
```

## Diverse actions

This ```navigationService``` can expand robustly to accommodate the various actions of different navigators such as Stack, Drawer, Switch, etc. that are required in the mobile App.

```
export function toggleDrawer() {
  const action = DrawerActions.toggleDrawer()
  dispatchAction(action)
}

export function pop() {
  const action = StackActions.pop()
  dispatchAction(action)
}
```

## Testing

Navigation is usually an area that seldom gets tested as it is usually left to the mercy of the React components handling them. It is relatively simple to write tests around navigation flows using ```navigationService``` and jest, and we can expect the mocked functions to be called with the appropriate parameters, as shown in the example below.

```
import navigate from 'navigationService'
const navigateMock = navigate
jest.mock('navigationService')

...
it('routes user to checkout screen', async() => {
    ...
    navigateMock.mockClear()
    const dispatched = []
    // mock values for user and state are passed to loginSaga
    await loginSaga(dispatched, { payload: user }, state)
    expect(navigateMock).toHaveBeenCalledWith('Checkout')
  })
...
```

## Conclusion

Based on this, it is easier to implement a navigation service that comes with these benefits:

- Separation of concerns where the navigation aspect is removed out of the React components.
- Handling complex scenarios powered by a middleware.
- Testability of navigation which is often ignored.