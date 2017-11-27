// @format
import { shallow } from 'enzyme'
import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

import { Home } from './Home'

describe('Home', () => {
  it('renders ', () => {
    const wrapper = shallow(<Home />)
    const home = <div>home!</div>
    expect(wrapper).toContainReact(home)
  })
})
