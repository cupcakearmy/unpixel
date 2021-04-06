import React from 'react'
import { render } from 'react-dom'

import '../base.css'

import About from './About'
import Settings from './Settings'
import Footer from './Footer'

const Main = () => {
  return (
    <div className="pa4">
      <About />
      <Settings />
      <Footer />
    </div>
  )
}

render(<Main />, window.document.querySelector('main'))
