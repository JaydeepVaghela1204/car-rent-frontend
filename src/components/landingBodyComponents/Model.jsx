import React, { useState } from 'react';
import { Button, Modal, Card } from 'antd';
import { Form, Col, Row, Alert } from 'react-bootstrap';

const Model = (props) => {
    const { showModal , isModalOpen , handleOk , handleCancel , handleChange  } = props
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Book Now
            </Button>

            <Modal title="Let's find you a car!"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form.Group as={Row} controlId="formHorizontalFirstName">
                    <Form.Label column sm={2}>Pickup Time</Form.Label>
                    <Col sm={10}>
                        <Form.Control name="pickupTime" type="datetime-local" onChange={handleChange} required />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalLastName">
                    <Form.Label column sm={2}>Return Time</Form.Label>
                    <Col sm={10}>
                        <Form.Control name="returnTime" type="datetime-local" onChange={handleChange} required />
                    </Col>
                </Form.Group>
            </Modal>
        </>
    )
}

export default Modal;