import React from 'react'
import { shallow } from 'enzyme'

import { NoMatch } from './NoMatch'

describe('NoMatch', () => {
  it('shows error page with a correct path name', () => {
    const location = {
      pathname: 'not-found-path',
    }
    const wrapper = shallow(<NoMatch location={location} />)
    expect(wrapper.find('code').text()).toEqual('not-found-path')
  })
})
