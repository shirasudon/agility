import React from 'react'
import ReactDOM from 'react-dom'
import {
  CircularProgressButton,
  withButtonHandlers,
} from './CircularProgressButton'
import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'
import { shallow, mount, render } from 'enzyme'

describe('CircularProgressButton', () => {
  it('calls handleButtonClick when clicked and does not show CircularProgress when isRequesting is false', () => {
    const props = {
      children: 'hoge',
      classes: {},
      isRequesting: false,
      handleButtonClick: jest.fn(),
      raised: false,
      disabled: false,
      color: 'primary',
    }

    const wrapper = shallow(<CircularProgressButton {...props} />)
    wrapper.find(Button).simulate('click')
    expect(props.handleButtonClick).toHaveBeenCalled()
    expect(wrapper.find(CircularProgress)).toHaveLength(0)
  })

  it('shows CircularProgress when isRequesting is true', () => {
    const props = {
      children: 'hoge',
      classes: {},
      isRequesting: true,
      handleButtonClick: jest.fn(),
      raised: false,
      disabled: false,
      color: 'primary',
    }

    const wrapper = shallow(<CircularProgressButton {...props} />)
    expect(wrapper.find(CircularProgress)).toHaveLength(1)
  })
})

describe('handleButtonClick', () => {
  it('does not call onClick when isRequesting is true', () => {
    const props = {
      onClick: jest.fn(),
      isRequesting: true,
    }

    const BaseComponent = ({ handleButtonClick }) => (
      <div> {handleButtonClick()} </div>
    )
    const Component = withButtonHandlers(BaseComponent)
    mount(<Component {...props} />)
    expect(props.onClick).not.toHaveBeenCalled()
  })

  it('calls onClick when isRequesting is false', () => {
    const props = {
      onClick: jest.fn(),
      isRequesting: false,
    }

    const BaseComponent = ({ handleButtonClick }) => (
      <div> {handleButtonClick()} </div>
    )
    const Component = withButtonHandlers(BaseComponent)
    mount(<Component {...props} />)
    expect(props.onClick).toHaveBeenCalled()
  })
})
