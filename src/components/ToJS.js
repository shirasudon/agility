import React from 'react'
import { Iterable } from 'immutable'

export const toJS = WrappedComponent => props => {
  const KEY = 0
  const VALUE = 1

  const propsJS = Object.entries(props).reduce((newProps, prop) => {
    newProps[prop[KEY]] = Iterable.isIterable(prop[VALUE])
      ? prop[VALUE].toJS()
      : prop[VALUE]
    return newProps
  }, {})

  return <WrappedComponent {...propsJS} />
}
