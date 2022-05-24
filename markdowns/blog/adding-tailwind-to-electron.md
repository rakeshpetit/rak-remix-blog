This post was originally published in the thoughtbot blog, [Giant Robots
Smashing Into Other Giant Robots].

[Giant Robots Smashing Into Other Giant Robots]:https://thoughtbot.com/blog/adding-tailwind-to-electron

[Tailwind CSS] is a utility first CSS framework in which developers focus on
writing inline styles compared to traditional CSS stylesheets. [An Honest Look
at Tailwind as an API for CSS] is an excellent post that explains more about
Tailwind.

How do we add Tailwind CSS to an [Electron JS] project? The purpose of this
guide is to add Tailwind to Electron JS and optimise the same for production.

[electron js]: https://www.electronjs.org/
[tailwind css]: https://v2.tailwindcss.com/
[an honest look at tailwind as an api for css]: https://thoughtbot.com/blog/an-honest-look-at-tailwind-as-an-api-for-css

## Electron React boilerplate

This article will use the [Electron React boilerplate]. If we are not using a
React based Electron setup, then this article might not be relevant to the
reader.

Ensure that [Node JS] is installed, and then clone the Electron React
boilerplate as per the [official installation guide]. Let us call our project
**tailwind-react**.

```
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git tailwind-react
cd tailwind-react
npm install
```

As per this guide, we will use `npm` as our package manager. Please refer to
[npm migration] if you prefer to use `yarn` instead.

## Run Electron

```
npm start
```

The above command will launch the Electron React app in debug mode. This should
open the default "Hello Electron React!" launch screen.

The Electron React boilerplate comes pre-installed with [react-router], the
standard router for React-based applications. Let us edit `src/renderer/App.tsx`
to simplify the default route.

- Delete the default `App.css` stylesheet as we will be integrating Tailwind
  soon.
- Remove unused `App.css` imports
- Change the JSX that's returned by the `Hello` component to something like below:

```
    <div>
      <h1>Hello Tailwind</h1>
    </div>
```

The Electron app should now display "Hello Tailwind" without any styling.

[electron react boilerplate]: https://electron-react-boilerplate.js.org/
[node js]: https://nodejs.org/
[official installation guide]: https://electron-react-boilerplate.js.org/docs/installation
[npm migration]: https://classic.yarnpkg.com/en/docs/migrating-from-npm/
[react-router]: https://v5.reactrouter.com/web/guides/quick-start

## Install Tailwind

Let us add `tailwindcss` and associated dependencies to our project. We will use
Tailwind CSS v2.2.19 for this tutorial as v3 was recently released.

```
npm install tailwindcss@2.2.19 postcss-loader autoprefixer postcss --save-dev
```

Notice how all the installed libraries are `devDependencies`. This is how
Tailwind works, generating required CSS at build time.

> Tailwind CSS works by scanning all of your HTML files, JavaScript components,
> and any other templates for class names, generating the corresponding styles
> and then writing them to a static CSS file.

## Set up Tailwind

### Tailwind webpack configuration

Open the file `.erb/configs/webpack.config.renderer.dev.ts` where we set up
rules for generating the styles using the installed plugins.

Scroll down to find the `module` object which contains the list of `rules`. Our
goal is to modify all the test (2 by default) rules. Along with the existing
`style-loader`, `css-loader` and `sass-loader`, we want to add a new
`postcss-loader` to the `use` array. We will specify the Post CSS configuration
after this step.

```
  module: {
    rules: [
      {
        test: /\.s?css$/,
          use: [
            ...
            'postcss-loader',

        ]
      }
    ]
  }
```

### PostCSS configuration

[Post CSS] with an excellent plugin ecosystem is a tool for transforming CSS
using JavaScript. Let's add some configuration in a file called
`postcss.config.js` at the root of the project and make sure we include
`tailwindcss` and `autoprefixer` plugins as per the code below:

```
/* eslint global-require: off, import/no-extraneous-dependencies: off */

module.exports = {
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
```

Based on my ES lint configuration, the first line was required but might not be
necessary for you.

[post css]: https://postcss.org/

### Tailwind configuration

Create a `tailwind.config.js` file at the root of the project and add an empty
configuration as shown below:

```
module.exports = {
  theme: {},
  variants: {},
  plugins: [],
};
```

This config object will be extended in the project eventually to contain our
app's themes such as fonts, colors, and other styling goodness.

### Add default Tailwind directives

Remember how we deleted the default `App.css`? Now would be a good time to bring
that back to add the default Tailwind directives.

Resurrect the `src/renderer/App.css` and add the directives below:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Test tailwind

Open `src/renderer/App.tsx`, and start writing Tailwind classes.

```
...
import './App.css'
...
  <div className="h-screen flex items-center justify-center bg-gray-200">
      <h1 className="text-blue-500">Hello Tailwind</h1>
  </div>
```

The Electron app should reflect the Tailwind CSS classes now, and this means we
successfully added Tailwind to our project.

## Optimise for production

`npm run build`

While building the production version of our electron app, I noticed that none
of the Tailwind CSS styles were applied on production, whereas it worked fine on
debug builds. After digging deeper, I found that the generated `style.css`
contained the standard tailwind directives (shown below) instead of actual CSS
styles.

```
@tailwindbase;@tailwind components;@tailwind utilities;
```

Remember how we modified the webpack configuration earlier? Turns out we only
modified it for dev and not production. Repeat the same process to add
`postcss-loader` to all the test rules in
`.erb/configs/webpack.config.renderer.prod.ts`.

The above step solved the `style.css` problems, which contained actual CSS
instead of tailwind directives. The production builds now contain the correct
CSS, and the App worked well. But, I was shocked by the size of `style.css` (3
MB) for a handful of CSS styles. Though this can be excused for an Electron app,
surely this size cannot be correct.

```
module.exports = {
  purge: {
  enabled: true,
  content: ['./src/*/.tsx'],
  }
  ...
}
```

After adding the above to `tailwind.config.js` as per docs, the size came down
to an acceptable 3 KB. Essentially, we asked Tailwind to go through all the
React component code (\*.tsx) and generate the most optimised styles based on
our usage. The Tailwind docs have a whole section of [optimizing for production]
with more such configuration options.

[optimizing for production]: https://v2.tailwindcss.com/docs/optimizing-for-production

## Conclusion

Congratulations! We added Tailwind to an Electron project and optimised it for
production by following this guide. This guide works with the state of the
current tooling and releases of Electron, React, and Tailwind CSS. The knowledge
of the installation, configuration and customisation of Tailwind with Electron
and how they integrate with React to generate the final CSS will hopefully
remain the same even with newer releases.
