// @format

import 'jest-enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { WebSocket } from 'mock-socket'

window.WebSocket = WebSocket

Enzyme.configure({ adapter: new Adapter() })
