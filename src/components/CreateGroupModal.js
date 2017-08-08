import React, { Component } from 'react';
import {connect} from 'react-redux';

import Dialog, { DialogTitle } from 'material-ui/Dialog';

class CreateGroupModal extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const {showModal, closeModal} = this.props;
        return (
            <Dialog open={showModal} onRequestClose={closeModal}>
                <DialogTitle>グループ作成</DialogTitle>
                <div>
                    <h4>友達を選んでください！</h4>
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(CreateGroupModal);
