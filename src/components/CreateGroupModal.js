import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'react-bootstrap';

class CreateGroupModal extends Component {

    constructor(props){
        super(props);
    }

    render(){
        const {showModal, closeModal} = this.props;
        return (
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>グループ作成</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>友達を選んでください！</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeModal}>閉じる</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(CreateGroupModal);
