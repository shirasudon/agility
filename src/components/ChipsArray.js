import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Chip from 'material-ui/Chip'
import { compose } from 'recompose'

const styleSheet = theme => ({
    chip: {
        margin: theme.spacing.unit / 2,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
})

export const ChipsArray = ({ classes, chipData, handleRequestDelete }) => (
    <div className={classes.row}>
        {
            chipData.map(
                user => (
                    <Chip
                        label={user.username}
                        key={user.id}
                        onRequestDelete={()=>{handleRequestDelete(user)}}
                        className={classes.chip}
                    />
                )
            )
        }
    </div>
)

ChipsArray.propTypes = {
    classes: PropTypes.object.isRequired,
}

export const enhancer = compose(
    withStyles(styleSheet),
)

export default enhancer(ChipsArray)

