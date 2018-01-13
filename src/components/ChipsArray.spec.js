// @format
import { shallow, mount } from 'enzyme'
import React from 'react'
import Chip from 'material-ui/Chip'

import { ChipsArray } from './ChipsArray'

describe('ChipsArray', () => {
  it('renders ChipsArray without crash', () => {
    const classes = {
      chip: {},
      row: {},
    }

    const chipData = [{ usename: 'user1', id: 1 }, { username: 'user2', id: 2 }]

    const wrapper = mount(<ChipsArray classes={classes} chipData={chipData} />)
    expect(wrapper.find(Chip)).toHaveLength(2)
  })

  it('handles onRequest Delete', () => {
    const classes = {
      chip: {},
      row: {},
    }

    const chipData = [{ usename: 'user1', id: 1 }, { username: 'user2', id: 2 }]

    const handleRequestDelete = jest.fn()

    const wrapper = mount(
      <ChipsArray
        classes={classes}
        chipData={chipData}
        handleRequestDelete={handleRequestDelete}
      />
    )
    expect(wrapper.find(Chip)).toHaveLength(2)
    wrapper
      .find('pure(Cancel)')
      .first()
      .simulate('click')
    expect(handleRequestDelete).toHaveBeenCalledWith(chipData[0])
  })
})
