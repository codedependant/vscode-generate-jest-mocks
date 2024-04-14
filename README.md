# generate-jest-mocks

Automatically generate Jest mocks for your Javascript/Typescript files based on module usage.

![](https://github.com/codedependant/vscode-generate-jest-mocks/demo.gif)

## Features

Consider the following file named `create_user.js`:

```js
const api = require("api");
const track = require("track");
const { flush } = require("cache");

function main(user) {
  const userID = api.users.create(user);
  track("create_user", userID);
  flush(userID);
}
```

Running `Generate Jest Mocks` from the test file `create_user.test.js` will result in the following manual Jest mocks being generated:

```js
jest.mock('api', () => ({
  users: {
    create: jest.fn(),
  }
});
jest.mock('track', () => jest.fn());
jest.mock('cache', () => ({ flush: jest.fn() }));

```

Or alternatively, when running `Generate Jest Auto Mocks`, Jest automocks can be generated:

```js
jest.mock("api");
jest.mock("track");
jest.mock("cache");
```

It also handles ES6 and Typescript files. For:

```ts
import cache, {set} from 'cache';

set('foo', 'bar');
cache.flush();
}
```

the following will be generated:

```js
jest.mock("cache", () => ({
  default: {
    flush: jest.fn(),
  },
  set: jest.fn(),
}));
```

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of generate-jest-mocks

---

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Write your code
4. Write tests that cover your code as much as possible
5. Run all tests and ensure they pass
6. Submit a pull request

Please try to keep your pull request small and focused. This will make it much easier to review and accept.
