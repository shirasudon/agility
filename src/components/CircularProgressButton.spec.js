import React from 'react'
import ReactDOM from 'react-dom'
import CircularProgressButton from './CircularProgressButton'
import Button from 'material-ui/Button'

import { mount, shallow, render } from 'enzyme'

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CircularProgressButton />, div);
});

it('calls onClick method when loading is off and onClick is passed to the component', () => {
    const onClick = jest.fn()
    const wrapper = mount(<CircularProgressButton onClick={onClick}/>)
    const button = wrapper.find(Button)
    expect(button.length).toBe(1)
    button.simulate('click')
    expect(onClick.mock.calls.length).toBe(1);
});

it('does not call onClick method when loading is on', () => {
    const onClick = jest.fn()
    const wrapper = mount(<CircularProgressButton status='loading' onClick={onClick}/>)
    const button = wrapper.find(Button)
    expect(button.length).toBe(1)
    button.simulate('click')
    expect(onClick.mock.calls.length).toBe(0);
});

it('does not call onClick method when onClick is undefined', () => {
    const onClick = jest.fn()
    const wrapper = mount(<CircularProgressButton status='loading'/>)
    const button = wrapper.find(Button)
    expect(button.length).toBe(1)
    button.simulate('click')
    expect(onClick.mock.calls.length).toBe(0);
});

