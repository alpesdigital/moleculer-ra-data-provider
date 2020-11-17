# moleculer-ra-data-provider
A [Moleculer](https://moleculer.services) compatible data provider for [React Admin](https://marmelab.com/react-admin/).

Convert on-the-fly data exchanged with Moleculer micro-services in order to use them directly in your React-Admin components like List, Edit, Create ....


## Features
Supported actions:

* `CREATE`
* `GET_ONE`
* `GET_LIST`
* `GET_MANY`
* `GET_MANY_REFERENCE`
* `UPDATE`
* `UPDATE_MANY`
* `DELETE`
* `DELETE_MANY`

## Installation

```sh
# via npm
npm install moleculer-ra-data-provider

# OR via yarn
yarn add moleculer-ra-data-provider
```

## Usage

Import this package, set the base url and pass it as the dataProvider to
react-admin.

```javascript
//in app.js
import React from "react";
import { Admin, Resource } from "react-admin";
import { ListGuesser } from 'react-admin'; // example

import moleculerDataProvider from 'moleculer-ra-data-provider';

const dataProvider = moleculerDataProvider('http://localhost:3000/api');

const App = () => (
  <Admin dashboard={Dashboard} dataProvider={dataProvider}>
    // example displaying a list received from http://localhost:3000/api/myusers 
    <Resource name="myusers"    list={ListGuesser} />
  </Admin>
);

export default App;
```

## Licence

MIT
