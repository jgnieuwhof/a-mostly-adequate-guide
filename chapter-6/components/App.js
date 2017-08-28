
import React from 'react'

import { curry, compose } from 'ramda'

const map = curry((fn, ary) => ary.map(fn))
const prop = curry((prop, obj) => obj[prop])

const withData = apiCall => Component =>
  class extends React.Component {
    state = { data: null }
    componentDidMount() {
      apiCall().then(data => this.setState({ data }))
    }
    render() {
      return (
        <Component data={this.state.data} {...this.props} />
      )
    }
  }

const Impure = {
  getJSON: url => () => (
    fetch(url)
      .then(x => x.text())
      .then(x => x.substring(1, x.length - 1))
      .then(compose(
        map(prop(`m`)),
        map(prop(`media`)),
        prop(`items`),
        JSON.parse,
      ))
  ),
  trace: curry((tag, x) => {
    debugger
    return x
  }),
}

const url = tags => `https://api.flickr.com/services/feeds/photos_public.gne?tags=${tags}&format=json&jsoncallback=?`
const photosByTag = compose(Impure.getJSON, url)

const ImageList = withData(photosByTag(`himmel`))(
  ({ data }) => (
    <div id='image-container'>
      { data && map(x => (<img key={x} src={x} />), data) }
    </div>
  ))

const App = () => (
  <div id='app-container'>
    <ImageList />
  </div>
)

export default App
