// @format
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow } from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div')
  shallow(<App />, div)
})

// TODO: do render test
