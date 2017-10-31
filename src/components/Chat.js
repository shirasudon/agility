import React from 'react'
import { connect } from 'react-redux'
import { lifecycle, compose } from 'recompose'

import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'

import { chatActionCreator } from '../actions'
import CreateGroupModal from './CreateGroupModal'
import SideTabs from './SideTabs'
import MessageWindow from './MessageWindow'

let cac = chatActionCreator

export const withLifecycles = lifecycle({
    componentDidMount() {
        const { fetchRooms, fetchFriends, session } = this.props
        if (Object.keys(session.user).length > 0) {
            fetchRooms(session.user.id)
            fetchFriends(session.user.id)
        }
    }
}) 

export const Chat = ({openCreateGroupModal: openModal}) => (
    <Grid container justify="center">
        <Grid item xs={3}>
            <CreateGroupModal />
            <Button onClick={openModal} >
            グループ作成
            </Button>
            <SideTabs/>
        </Grid>
        <Grid item xs={6}>
            <MessageWindow/>
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
        dispatch(cac.fetchRooms(userId));
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
    withLifecycles
)

export default enhancer(Chat)
