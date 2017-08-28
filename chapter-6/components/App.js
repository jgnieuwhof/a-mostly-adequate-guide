
import React from 'react'

import { curry } from 'ramda'

const Impure = {
  getJSON: curry((callback, url) => (
    fetch(url).then(x => x.json()).then(callback)
  ),
  trace: curry((tag, x) => {
    console.log(tag, x)
    return x
  }),
}

const App = () => (
  <div id='app-container'>Hello World!</div>
)

export default App
