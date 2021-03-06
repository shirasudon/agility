// @format
import React from 'react'
import { shallow, mount, render } from 'enzyme'

import { withMessageWindowHandlers, ChatInput } from './ChatInput'
import { KEY_ENTER } from '../keyCodes'

describe('withMessageWindowHandlers', () => {
  let props
  beforeEach(() => {
    props = {
      setCurText: jest.fn(),
      curText: 'current text',
      currentRoomId: 2,
      sendMessage: jest.fn(),
      myId: 5,
    }
  })

  describe('handleKeyPress', () => {
    it('sends a message and set current text to empty when enter key is pressed', () => {
      const DummyComponent = ({ handleKeyPress }) => (
        <div>{handleKeyPress({ which: KEY_ENTER })}</div>
      )
      const Component = withMessageWindowHandlers(DummyComponent)
      mount(<Component {...props} />)
      expect(props.sendMessage).toHaveBeenCalledWith({
        userId: 5,
        roomId: 2,
        body: 'current text',
      })
      expect(props.setCurText).toHaveBeenCalledWith('')
    })

    it('does not send a message and set current text to empty when key other than enter key is pressed', () => {
      const DummyComponent = ({ handleKeyPress }) => (
        <div>{handleKeyPress({ which: 20 })}</div>
      )
      const Component = withMessageWindowHandlers(DummyComponent)
      mount(<Component {...props} />)
      expect(props.sendMessage).not.toHaveBeenCalled()
      expect(props.setCurText).not.toHaveBeenCalled()
    })

    it('does not send a message when current text consists only of spaces (e.g., tab, whitespace, etc)', () => {
      const props = {
        setCurText: jest.fn(),
        curText: ' \t \t  ',
        currentRoomId: 2,
        sendMessage: jest.fn(),
        myId: 5,
      }

      const DummyComponent = ({ handleKeyPress }) => (
        <div>{handleKeyPress({ which: KEY_ENTER })}</div>
      )
      const Component = withMessageWindowHandlers(DummyComponent)
      mount(<Component {...props} />)
      expect(props.sendMessage).not.toHaveBeenCalled()
      expect(props.setCurText).not.toHaveBeenCalled()
    })

    it('sends a trimmed message when current text contains at least one non-space character', () => {
      const props = {
        setCurText: jest.fn(),
        curText: ' \thello\t  ',
        currentRoomId: 2,
        sendMessage: jest.fn(),
        myId: 5,
      }

      const DummyComponent = ({ handleKeyPress }) => (
        <div>{handleKeyPress({ which: KEY_ENTER })}</div>
      )
      const Component = withMessageWindowHandlers(DummyComponent)
      mount(<Component {...props} />)
      expect(props.sendMessage).toHaveBeenCalledWith({
        userId: props.myId,
        roomId: props.currentRoomId,
        body: props.curText.trim(),
      })
      expect(props.setCurText).toHaveBeenCalledWith('')
    })
  })

  describe('handleChange', () => {
    it('set current text when handleChange is called', () => {
      const DummyComponent = ({ handleChange }) => (
        <div>{handleChange({ target: { value: 'hoge' } })}</div>
      )
      const Component = withMessageWindowHandlers(DummyComponent)
      mount(<Component {...props} />)
      expect(props.setCurText).toHaveBeenCalledWith('hoge')
    })
  })
})

describe('ChatInput', () => {
  it('should show current text', () => {
    const props = {
      curText: 'hello',
    }
    const wrapper = shallow(<ChatInput {...props} />)
    expect(wrapper.prop('value')).toBe(props.curText)
  })

  it('should call handleKeyPress on keypress', () => {
    const props = {
      handleKeyPress: jest.fn(),
    }
    const wrapper = shallow(<ChatInput {...props} />)
    wrapper.simulate('keypress')
    expect(props.handleKeyPress).toHaveBeenCalled()
  })

  it('should call handleChange on keypress', () => {
    const props = {
      handleChange: jest.fn(),
    }
    const wrapper = shallow(<ChatInput {...props} />)
    wrapper.simulate('change')
    expect(props.handleChange).toHaveBeenCalled()
  })
})
