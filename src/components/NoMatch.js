import React from 'react'

export const NoMatch = ( { location } ) => (
    <div>
        <h3>I'm sorry but <code>{location.pathname}</code> could not be found!</h3>
    </div>
)

export default NoMatch
