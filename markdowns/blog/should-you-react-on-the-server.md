This post was originally published in the thoughtbot blog, [Giant Robots
Smashing Into Other Giant Robots].

[Giant Robots Smashing Into Other Giant Robots]:https://thoughtbot.com/blog/should-you-react-on-the-server

Just before Christmas 2020, Facebook engineers decided to tease the community
with the new [React Server components]. This is still experimental, which will
incrementally evolve during the course of the year and definitely cannot be used
on production in its current state. Frameworks like [Next JS], Remix, etc would
leverage this power and the React core team would be working closely with them
to get a production-ready version hopefully by the end of 2021. React server
components could be a potential game-changer for an already dominant JS
ecosystem as it attempts to bring React to the server powered by a Node JS
backend.

[React Server components]: https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html

[Next JS]: https://nextjs.org/

## What is Server-side rendering (SSR)?

Before understanding server components, it is essential to understand
Server-side rendering (SSR). SSR is a popular technique for
optimizing the speed of an application's initial page load. This is helpful if
your application has to load a large JS bundle and also improves it from a
Search Engine Optimisation perspective. Once the initial page's HTML markup as
sent by the server gets rendered, the JS bundle is eventually downloaded
(hydrated in SSR terminology) to make the application interactive and usable.
While server-side rendering and server components can sound like similar
features on the surface, they are actually quite different.

## Why server components?

Server components would work and interact with the server throughout the
lifecycle of the application and not just the initial page load like SSR. Using
Server components, the DOM tree can be updated without losing the App state
(focus, scroll position, text inputs, selected checkboxes, etc) whereas this
information is lost using a traditional server-rendered approach.

Some of the challenges of React or single page applications in general that get
addressed by server components are:

### Zero bundle size

- Reduced bundle size of the app by making certain components render on the
  server.
- Developers need not worry about those costly `momentjs` or `lodash` imports
  anymore. Freely import and use them on a server component, and be assured that
  those libraries won't be packaged to the client.

```javascript
import React from 'react'
import moment from 'moment'

export default function Header() {
    return (
      <header>
        <div> It's {moment().format('DD/MM/YYYY hh:mm')}</div>
      </header>
    );
}
```

A simple React component such as the one above can either be a client component
or a server component depending upon the requirements. If it is a server
component, it will not even be a part of the bundle along with the associated
imports which is truly impressive. React core team expects bundle size reduction
of up to 30% for an application utilizing server components.

<figure>
  <img alt="Image showing a client component bundle"
    src="https://images.thoughtbot.com/blog-vellum-image-uploads/MQEnBtJQ6v8BdNE9giEQ_client%20component%20bundle.png">
  <figcaption>Header.client.js which imports moment is seen on node_modules.</figcaption>
</figure>

<figure>
  <img alt="Image showing a server component bundle"
    src="https://images.thoughtbot.com/blog-vellum-image-uploads/Z2QTX9c1Thi6Ufh2zTK5_server%20component%20bundle.png">
  <figcaption>Header.server.js along with the moment imports is not seen on node_modules.</figcaption>
</figure>

### Avoid waterfalls

Avoid the sever to client waterfall where we make a chain of requests as the UI
loads. A typical React app could have multi-level nested components and each
component as it loads may have side effects to load its required data that leads
to a chain of requests causing such a waterfall. Waterfall as such is not a bad
pattern but the sequential nature of how it cascades between the client and
server causes additional network round trips thus hurting application
performance.

![Water-fall](https://images.thoughtbot.com/blog-vellum-image-uploads/Rzlpp0rUTwmSPXuTrltU_waterfall%20fetch.png)

The [RFC] link explores more features such as automatic code-splitting, full
access to the database/backend along with the above in great detail.

[RFC]: https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#motivation

## What are server components?

`Server components` (components named \*.server.js) are React components that
are processed and rendered by a server (mostly Node JS). Since the server has no
knowledge of a client, these components neither have access to the React state
tree nor can have side effects like actual React components. Server components
are never sent to the client which is why we are free to access the file-system
or database, run SQL queries, and much more on the server. The communication
between the server and the client happens using intermediary stream
representations and the client reconstructs the state tree based on this stream
data which looks like the image below.

![Water-fall](https://images.thoughtbot.com/blog-vellum-image-uploads/R8z7VvkvQTiyiq9YlqnB_Stream%20representation.png)

`Client components` (components named \*.client.js) on the other hand are your
everyday React components that you’ve been using all along. In addition to
these, we also have `shared components` (components named \*.js) that can
function as both client and server components mainly used to facilitate code
reuse. More details on the naming conventions can be found in the RFC document
and expected to change a lot as the feature matures.

The ability to maintain the client-side state while fetching streams of
information from the server and outsourcing the necessary computations of a
component to the server is the crux of server components.

## Shortcomings / Under development

React server components evolving and becoming mainstream might lead to
technologies/libraries such as Redux, GraphQL, etc becoming obsolete or used
less in projects as more work gets outsourced to the server. This is not
essentially a bad thing and is part of the evolution rightly accepted by the
React core team.

The demo seems to cleverly avoid any kind of routing which seems to be a work in
progress. It's still unclear how different areas of a web application such as
routing, CSS in JS, etc work with server components. As much as we are in the
early stages and almost non-existent documentation, it would be interesting to
watch how frameworks such as Next JS leverage this power and integrate this into
their libraries.

As much as Node JS as a server is highly performant, it is still not widely
adopted as the industry has popular alternatives from a wide variety of
programming languages. It appears that React server components are tightly
coupled to work on a Node JS environment and is unlikely to change as React
after all is a JavaScript library.

## Is the pendulum swinging?

The industry loves to engage in framework/language wars and it comes as no
surprise that server components triggered the same with those championing
traditional server-rendered HTML based web frameworks (Rails, PHP, JSP) quick to
conclude that they were right all along and the pendulum is swinging back to the
server. As a former Java developer and a JS enthusiast embracing its ecosystem
for a few years now, evolution of languages/frameworks is imminent in response
to changing industry needs.

[Express JS], a widely adopted Node JS based framework has been around for a
decade; It has been stable with more Github stars and lesser issues than its
rivals considering that the JS ecosystem is often accused of constantly changing
and being unstable. The point is sending HTML responses to a client has been an
integral part of multiple frameworks of the last decade irrespective of the
programming languages. Despite that, the JS ecosystem evolved to a single page
application centric world with a plethora of frameworks during this period and
one of them today is paving the way to mix the best of both client-side and
server-side applications. The key here is not to view this as a pendulum swing
and instead admire its shine on either side.

![Server-components](https://images.thoughtbot.com/blog-vellum-image-uploads/iSVDus7ySqyWtoWVjnCY_Server%20components.png)

[Express JS]: https://github.com/expressjs/express

An idea such as server components expects us to change our mental models and
view the application as one big component tree instead of the usual
server/client model. This means choose the different parts of the application
that should be rendered by the client and the server by making the choice at the
component level.

## Conclusion

*"It is not the strongest of the species that survives, nor the most
intelligent, but the one most responsive to change"* - Charles Darwin

The last decade has been a juggernaut for the JavaScript ecosystem resulting in
the birth and death of a lot of new frameworks/libraries where the language
itself has had multiple iterative changes ([ECMAScript]) on a continuous basis
and the decade ahead seems to hold nothing less for developers. With that in
mind, it would be wise to acknowledge, adapt and compete to build
frameworks/software that helps developers engineer performant, high-quality
applications rather than engage in hot takes and quick dismissals. Hopefully, we
see more of the former and positive changes in 2021.

The RFC document along with its [video] provides a lot of fine details worth
taking a look at.

[video]:
https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html
[ECMAScript]: https://en.wikipedia.org/wiki/ECMAScript#History
