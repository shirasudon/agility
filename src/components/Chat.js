import React from 'react'
import { connect } from 'react-redux'
import { lifecycle, compose } from 'recompose'
import { withStyles } from 'material-ui/styles'

import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'

import { chatActionCreator } from '../actions'
import CreateGroupModal from './CreateGroupModal'
import SideTabs from './SideTabs'
import MessageWindow from './MessageWindow'

let cac = chatActionCreator

const styles = {
    root: {
        height: "88%",
    },
    sideTabs: {
        height: "100%",
    },
    messageWindow: {
        height: "100%",
    }
}


export const withLifecycles = lifecycle({
    componentDidMount() {
        const { fetchRooms, fetchFriends, session } = this.props
        fetchRooms(session.user.id)
        fetchFriends(session.user.id)
    }
})

export const Chat = ({ openCreateGroupModal: openModal, classes }) => (
    <Grid container justify="center" className={classes.root}>
        <Grid item xs={3} className={classes.sideTabs}>
            <CreateGroupModal />
            <Button onClick={openModal} >
            グループ作成
            </Button>
            <SideTabs />
        </Grid>
        <Grid item xs={6} className={classes.messageWindow}>
            <MessageWindow />
        </Grid>
    </Grid>
)

export function setChatActionCreator(actionCreator) {
    cac = actionCreator 
}

const mapStateToProps = ({entities, session}) => ({
    entities,
    session,
});

export const mapDispatchToProps = (dispatch) => ({
    fetchRooms: (userId) => {
        dispatch(cac.fetchRooms(userId))
    },
    fetchFriends: (userId) => {
        dispatch(cac.fetchFriends(userId))
    },
    openCreateGroupModal: () => {
        dispatch(cac.openCreateGroupModal());
    },
})

export const enhancer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycles,
    withStyles(styles),
)

export default enhancer(Chat)
