import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';

const styleSheet = theme => ({
    chip: {
        margin: theme.spacing.unit / 2,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
});

export function ChipsArray(props) {

    const {classes, chipData, handleRequestDelete} = props;

    return (
        <div className={classes.row}>
            {chipData.map(data => {
                return (
                    <Chip
                        label={data.label}
                        key={data.key}
                        onRequestDelete={()=>{handleRequestDelete(data);}}
                        className={classes.chip}
                    />
                );
            })}
            </div>
    );
}

ChipsArray.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(ChipsArray);
