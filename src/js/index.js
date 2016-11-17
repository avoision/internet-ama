import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Match, Miss } from 'react-router'

import Home from './components/Home'

// import './css/style.css'
// import App from './components/App'
// import StorePicker from './components/StorePicker'
// import NotFound from './components/NotFound'

const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={Home} />
        <Match pattern="/share" component={Home} />
      </div>
    </BrowserRouter>
  )
}


render(<Root />, document.querySelector('#main')) 
