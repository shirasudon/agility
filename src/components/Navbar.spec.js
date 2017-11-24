import React from 'react'
import { shallow, mount, render } from 'enzyme'

import Button from 'material-ui/Button'

import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('shows login button when not authenticated', () => {
    const props = {
      logout: jest.fn(),
      authenticated: false,
      classes: {},
    }
    const wrapper = shallow(<Navbar {...props} />)
    expect(wrapper.find(Button)).toHaveLength(1)
    expect(wrapper.find(Button).contains('Login')).toEqual(true)
  })

  it('shows logout button when not authenticated', () => {
    const props = {
      logout: jest.fn(),
      authenticated: true,
      classes: {},
    }
    const wrapper = shallow(<Navbar {...props} />)
    expect(wrapper.find(Button)).toHaveLength(1)
    expect(wrapper.find(Button).contains('Logout')).toEqual(true)
  })
})
