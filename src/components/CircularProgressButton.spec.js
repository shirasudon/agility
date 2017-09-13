import React from 'react'
import ReactDOM from 'react-dom'
import CircularProgressButton from './CircularProgressButton'
import Button from 'material-ui/Button'
import { createShallow, createRender } from 'material-ui/test-utils'
import configureMockStore from 'redux-mock-store'

const middlewares = [];
const mockStore = configureMockStore(middlewares);

let shallow;
let render;

beforeAll(() => {
    shallow = (component, store) => {
        const context = {
            store
        };
        const shallowWithDive = createShallow({ dive: true });
        shallowWithDive(component, {context})
    };

    render = (component, store) => {
        const context = {
            store
        };
        const enhancedRender = createRender();
        enhancedRender(component, {context})
    };
});

it('renders without crashing', () => {
    const store = mockStore({
        ui: {}
    });
    render(<CircularProgressButton />, store);
});

it('calls onClick method when loading is off and onClick is passed to the component', () => {
    const store = mockStore({
        ui: {
            createModal: {
                isLoading: false,
            }
        }
    });
    const onClick = jest.fn();
    const wrapper = shallow(<CircularProgressButton onClick={onClick}/>, store);
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    button.simulate('click');
    expect(onClick.mock.calls.length).toBe(1);
});

it('does not call onClick method when loading is on', () => {
    const store = mockStore({
        ui: {
            createModal: {
                isLoading: true,
            }
        }
    });
    const onClick = jest.fn();
    const wrapper = shallow(<CircularProgressButton status='loading' onClick={onClick}/>, store);
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    button.simulate('click');
    expect(onClick.mock.calls.length).toBe(0);
});

it('does not call onClick method when onClick is undefined', () => {
     const store = mockStore({
        ui: {
            createModal: {
                isLoading: false,
            }
        }
    });
    const onClick = jest.fn();
    const wrapper = shallow(<CircularProgressButton />, store );
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    button.simulate('click');
    expect(onClick.mock.calls.length).toBe(0);
});

