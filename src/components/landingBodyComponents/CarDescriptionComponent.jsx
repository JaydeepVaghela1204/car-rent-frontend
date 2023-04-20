import React, { useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import '../../styles/cars.css';
import { Button, Modal, Card } from 'antd';
import { VscLocation } from 'react-icons/vsc'
import CarTable from './carTable.jsx';
import '../../styles/filterCar.css';
import SimpleImageSlider from "react-simple-image-slider";
import './carDescription.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

function CarDescriptionComponent(props) {
    const [component, setComponent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pickupTime, setPickupTime] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [sendPickup , setSendPickup] = useState('');
    const [sendReturn , setsendReturn] = useState('');

    const handlePickup = event => {
        setSendPickup({ [event.target.name]: event.target.value });
        setPickupTime(event.target.value);
    };

    const handleReturn = event => {
        setsendReturn({ [event.target.name]: event.target.value });
        setReturnTime(event.target.value);
    };

    const showModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleOk = () => {
        if (pickupTime === "") {
            alert("Please Enter pickupTime...");
        } else if (returnTime === "") {
            alert("Please Enter returnTime...");
        } else {
            const pickup = new Date(pickupTime);
            const returnt = new Date(returnTime);
            if (pickup >= returnt) {
                alert("Invalid date range! Please try again.")
            } else if (pickup < Date.now()) {
                alert("Time must be in the future! Please try again.");
            } else {
                setComponent("car-Table")
            }
        }
    };

    const handleCancel = () => {
        setComponent("");
        setIsModalOpen(false);
    };

    // car description component card
    const { car } = props
    // console.log("image",props.image);

    return (
        <Col sm={4}>
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
                <Link to={{
                    pathname: '/car_detail',
                    state: {
                        car: car,
                    }
                }}

                    style={{
                        textDecoration: 'none'
                    }}
                >
                    <Card
                        // cover
                        hoverable
                        // bordered
                        // bodyStyle={{
                        //     boxShadow: "0 5px 30px black"
                        // }}
                        style={{
                            borderRadius: 0,
                            width: 220,
                            height: 270,
                            // backgroundColor: "rgba(41, 39, 39, 0.3)",
                            // boxShadow: "0 5px 30px black",
                            // color: "white",
                            padding: 0,
                            marginBottom: "20px"
                        }}
                    >
                        <div style={{ marginTop: "-24.5px", marginLeft: "-24.5px" }}>
                            {/* <img style={{ height: "125px", width: "220px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} src={car.image} alt="car" /> */}

                            <SimpleImageSlider
                                width="220px"
                                height="130px"
                                images={car.image.map((images, index) =>
                                    images
                                )
                                }
                                // showBullets={true}
                                // showNavs={true}
                                autoPlay
                                style={{
                                    borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                                }}
                            />

                        </div>
                        <div style={{ justifyContent: "space-between" }}>
                            <div style={{ marginLeft: "-10px", marginTop: "2px" }}>
                                <div className='cartitle'>{car.make}</div>
                                <div className='carprice'><strong>₹{car.costperhour} </strong><p style={{ fontSize: "12px", paddingLeft: "3px" }}> per hours,{car.bodytype} car</p></div>
                                <div style={{ marginTop: "-19px", marginLeft: "-4px" }}><VscLocation style={{ fontSize: "16px" }} />{car.location}</div>
                            </div>
                            <div style={{ marginTop: "-1px", marginLeft: "-10px" }}>
                                <Button style={{ background: "linear-gradient(315deg, #ffbc00, #ff0058)" }} onClick={showModal}>
                                    Book
                                </Button>
                            </div>
                        </div>
                        <div style={{ marginTop: "15px", fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                            <div>{car.seats}-Seater</div>
                            <div>|</div>
                            <div>{car.location}</div>
                            <div>|</div>
                            <div>{car.fueltype}</div>
                        </div>
                    </Card>
                </Link>
            </div>
            <div>
                <Modal title="Let's find you a car!"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    {component === "" ?
                        <Form>
                            <Form.Group as={Row} controlId="formHorizontalFirstName">
                                <Form.Label column sm={2}>Pickup Time</Form.Label>
                                <Col sm={10}>
                                    <Form.Control name="pickupTime" type="datetime-local" onChange={handlePickup} required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalLastName">
                                <Form.Label column sm={2}>Return Time</Form.Label>
                                <Col sm={10}>
                                    <Form.Control name="returnTime" type="datetime-local" onChange={handleReturn} required />
                                </Col>
                            </Form.Group>
                        </Form>
                        : <CarTable car={car} pickupTime={sendPickup} returnTime={sendReturn} />
                    }
                </Modal>
            </div>
        </Col>
    );
}

export default CarDescriptionComponent;