// @format

import React from 'react'
import { shallow, mount } from 'enzyme'
import moment from 'moment'

import {
  withChatHistoryHandlers,
  ChatHistory,
  sendReadIfExistNonRead,
  withLifecycleFactory,
  scrollToBottom,
} from './ChatHistory'
import Balloon from './Balloon'

describe('handleScroll', () => {
  it('calls fetchHistory with current room id and oldest message timestamp when the scroll bar is at the top', () => {
    const BaseComponent = ({ handleScroll }) => {
      handleScroll({ target: { scrollTop: 0 } })
      return <div>hoge</div>
    }
    const Component = withChatHistoryHandlers(BaseComponent)
    const props = {
      currentRoomId: 3,
      fetchHistory: jest.fn(),
      entities: { rooms: { byId: { 3: { oldestMessageTimestamp: 10000 } } } },
    }
    const wrapper = mount(<Component {...props} />)
    expect(props.fetchHistory).toHaveBeenCalledWith(
      props.currentRoomId,
      props.entities.rooms.byId[3].oldestMessageTimestamp
    )
  })

  it('does NOT call fetchHistory when the scroll bar is NOT at the top', () => {
    const BaseComponent = ({ handleScroll }) => {
      handleScroll({ target: { scrollTop: 100 } })
      return <div>hoge</div>
    }
    const Component = withChatHistoryHandlers(BaseComponent)
    const props = {
      currentRoomId: 3,
      fetchHistory: jest.fn(),
      entities: { rooms: { byId: { 3: { oldestMessageTimestamp: 10000 } } } },
    }
    const wrapper = mount(<Component {...props} />)
    expect(props.fetchHistory).not.toHaveBeenCalled()
  })
})

describe('sendReadIfExistNonRead', () => {
  it('calls sendRead when the last message is not read by the current user', () => {
    const props = {
      sendRead: jest.fn(),
      entities: {
        messages: {
          byId: {
            5: {
              id: 5,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-10T21:57:29+09:00').valueOf(),
            },
            6: {
              id: 6,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-13T21:57:29+09:00').valueOf(),
            },
          },
          byRoomId: {
            3: [5, 6],
          },
        },
      },
      currentRoomId: 3,
      myId: 2,
    }
    sendReadIfExistNonRead(props)
    expect(props.sendRead).toHaveBeenCalledWith(
      props.currentRoomId,
      props.entities.messages.byId[6].createdAt
    )
  })

  it('doest NOT call sendRead when the last message has already been read by the current user', () => {
    const props = {
      sendRead: jest.fn(),
      entities: {
        messages: {
          byId: {
            5: {
              id: 5,
              // actually the situation should not exist where the last message is read but previous ones are not.
              // But this is just to test if the method only looks at the last message
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-10T21:57:29+09:00').valueOf(),
            },
            6: {
              id: 6,
              readBy: [1, 2, 3, 5],
              createdAt: moment('2018-01-13T21:57:29+09:00').valueOf(),
            },
          },
          byRoomId: {
            3: [5, 6],
          },
        },
      },
      currentRoomId: 3,
      myId: 2,
    }
    sendReadIfExistNonRead(props)
    expect(props.sendRead).not.toHaveBeenCalled()
  })

  it('doest NOT call sendRead when the current room does not have any message', () => {
    const props = {
      sendRead: jest.fn(),
      entities: {
        messages: {
          byId: {},
          byRoomId: {},
        },
      },
      currentRoomId: 3,
      myId: 2,
    }
    sendReadIfExistNonRead(props)
    expect(props.sendRead).not.toHaveBeenCalled()
  })
})

describe('withLifecycle', () => {
  it('calls sendReadIfExistNonRead and scrollToBottom when component is mounted', () => {
    const sendReadIfExistNonRead = jest.fn()
    const scrollToBottom = jest.fn()
    const BaseComponent = () => <div>dummy component</div>
    const Component = withLifecycleFactory(
      sendReadIfExistNonRead,
      scrollToBottom
    )(BaseComponent)
    const props = {
      a: 2,
      b: 3,
      refs: {
        messageList: {
          a: 2,
        },
      },
    }
    shallow(<Component {...props} />)
    expect(sendReadIfExistNonRead).toHaveBeenCalledWith(props)
    expect(scrollToBottom).toHaveBeenCalledWith(props.refs.messageList)
  })

  it('calls sendReadIfExistNonRead and scrollToBottom when the room is changed', () => {
    const sendReadIfExistNonRead = jest.fn()
    const scrollToBottom = jest.fn()
    const BaseComponent = () => <div>dummy component</div>
    const Component = withLifecycleFactory(
      sendReadIfExistNonRead,
      scrollToBottom
    )(BaseComponent)
    const constantProps = {
      entities: {
        messages: {
          byId: {
            5: {
              id: 5,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-10T21:57:29+09:00').valueOf(),
            },
            6: {
              id: 6,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-13T21:57:29+09:00').valueOf(),
            },
          },
          byRoomId: {
            3: [5, 6],
          },
        },
      },
      refs: {
        messageList: {
          scrollTop: 10,
          scrollHeight: 10,
          clientHeight: 10,
        },
      },
    }
    const props = {
      currentRoomId: 2,
      ...constantProps,
    }
    const nextProps = {
      currentRoomId: 3,
      ...constantProps,
    }

    const wrapper = shallow(<Component {...props} />, {
      lifecycleExperimental: true,
    })
    wrapper.setProps(nextProps)
    expect(sendReadIfExistNonRead).toHaveBeenCalledTimes(2)
    expect(sendReadIfExistNonRead.mock.calls[1]).toEqual([nextProps])
    expect(scrollToBottom).toHaveBeenCalledTimes(2)
    expect(scrollToBottom.mock.calls[1]).toEqual([nextProps.refs.messageList])
  })

  it('calls sendReadIfExistNonRead when the message length is changed', () => {
    const sendReadIfExistNonRead = jest.fn()
    const BaseComponent = () => <div>dummy component</div>
    const Component = withLifecycleFactory(sendReadIfExistNonRead, () => {})(
      // scrollToBottom is set as empty func
      BaseComponent
    )
    const constantProps = {
      currentRoomId: 3,
      refs: {
        messageList: {
          scrollTop: 10,
          scrollHeight: 10,
          clientHeight: 10,
        },
      },
    }
    const props = {
      ...constantProps,
      entities: {
        messages: {
          byId: {
            5: {
              id: 5,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-10T21:57:29+09:00').valueOf(),
            },
          },
          byRoomId: {
            3: [5],
          },
        },
      },
    }
    const nextProps = {
      ...constantProps,
      entities: {
        messages: {
          byId: {
            5: {
              id: 5,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-10T21:57:29+09:00').valueOf(),
            },
            6: {
              id: 6,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-13T21:57:29+09:00').valueOf(),
            },
          },
          byRoomId: {
            3: [5, 6],
          },
        },
      },
    }

    const wrapper = shallow(<Component {...props} />, {
      lifecycleExperimental: true,
    })
    wrapper.setProps(nextProps)
    expect(sendReadIfExistNonRead).toHaveBeenCalledTimes(2)
    expect(sendReadIfExistNonRead.mock.calls[1]).toEqual([nextProps])
  })

  it('calls sendReadIfExistNonRead when it receives the first message in the room', () => {
    const sendReadIfExistNonRead = jest.fn()
    const BaseComponent = () => <div>dummy component</div>
    const Component = withLifecycleFactory(sendReadIfExistNonRead, () => {})(
      // scrollToBottom is set as empty func
      BaseComponent
    )
    const constantProps = {
      currentRoomId: 3,
      refs: {
        messageList: {
          scrollTop: 10,
          scrollHeight: 10,
          clientHeight: 10,
        },
      },
    }
    const props = {
      ...constantProps,
      entities: {
        messages: {
          byId: {},
          byRoomId: {},
        },
      },
    }
    const nextProps = {
      ...constantProps,
      entities: {
        messages: {
          byId: {
            5: {
              id: 5,
              readBy: [1, 3, 5],
              createdAt: moment('2018-01-10T21:57:29+09:00').valueOf(),
            },
          },
          byRoomId: {
            3: [5],
          },
        },
      },
    }

    const wrapper = shallow(<Component {...props} />, {
      lifecycleExperimental: true,
    })
    wrapper.setProps(nextProps)
    expect(sendReadIfExistNonRead).toHaveBeenCalledTimes(2)
    expect(sendReadIfExistNonRead.mock.calls[1]).toEqual([nextProps])
  })
})

describe('ChatHistory', () => {
  it('shows chat history given messages in entity', () => {
    const props = {
      currentRoomId: 5,
      entities: {
        users: {
          byId: {
            '2': {
              id: 2,
              username: 'user2',
            },
            '3': {
              id: 3,
              username: 'user3',
            },
          },
        },
        messages: {
          byRoomId: {
            '5': [1, 3, 5],
          },
          byId: {
            '1': {
              id: 1,
              userId: 2,
              text: 'first message',
              createdAt: 'date1', // createdAt actuall should be # of milliseconds
            },
            '3': {
              id: 3,
              userId: 3,
              text: 'second message',
              createdAt: 'date2', // createdAt actuall should be # of milliseconds
            },
            '5': {
              id: 5,
              userId: 2,
              text: 'third message',
              createdAt: 'date3', // createdAt actuall should be # of milliseconds
            },
          },
        },
      },
      session: {
        user: {
          id: 2,
        },
      },
      classes: {
        root: 'chatHistory',
      },
    }

    const wrapper = shallow(<ChatHistory {...props} />)
    const historyContainer = wrapper.find('.' + props.classes.root)
    expect(historyContainer).toHaveLength(1)
    const balloons = historyContainer.find(Balloon)
    expect(balloons).toHaveLength(3)

    expect(balloons.at(0).prop('message')).toBe(props.entities.messages.byId[1])
    expect(balloons.at(1).prop('message')).toBe(props.entities.messages.byId[3])
    expect(balloons.at(2).prop('message')).toBe(props.entities.messages.byId[5])
  })
})
