/* Filter cars page */
import React, { Component } from 'react';
import { Form, Button, Alert, Row, Container } from 'react-bootstrap';
import CarServiceApi from '../../api/CarServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_SEATS, CAR_FUEL_TYPES } from '../../Constants.js';
import LocationServiceApi from '../../api/LocationServiceApi';
import BookingConfirmDetailsPopUp from './bookingConfirmDetails';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { VscLocation } from 'react-icons/vsc'
import '../../styles/filterCar.css';
import SimpleImageSlider from "react-simple-image-slider";


class FilterCarsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            availableCars: [],
            make: '',
            seats: 'Any',
            fueltype: 'Any',
            colour: 'Any',
            location: 'Any',
            bodytype: 'Any',
            locations: [],
            errorMessage: '',
            popUp: false,
            selectedCar: ''
        };
        this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.togglePopUp = this.togglePopUp.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmitFilter = event => {
        event.preventDefault();
        // filter available cars based on attributes specified
        let newFilter = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime,
            availableCars: this.state.availableCars,
            make: this.state.make,
            seats: this.state.seats,
            fueltype: this.state.fueltype,
            colour: this.state.colour,
            location: this.state.location,
            bodytype: this.state.bodytype
        };
        // publish filter cars request to backend
        CarServiceApi.filterCars(newFilter).then(res => {
            this.setState({
                availableCars: res.data.availableCars,
                errorMessage: ''
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message, availableCars: [] });
        });
    }

    togglePopUp(car) {
        if (this.state.popUp)
            car = null;
        this.setState({
            popUp: !this.state.popUp,
            selectedCar: car
        });
    }

    componentDidMount() {
        const { availableCars, pickupTime, returnTime } = this.props;

        // redirect to dashboard if props don't exist
        if (availableCars.length === 0 || pickupTime === '' || returnTime === '') {
            this.props.history.push('/dashboard');
        }

        this.setState({
            availableCars: availableCars,
            pickupTime: pickupTime,
            returnTime: returnTime
        });

        // obtain all locations
        let locationArray = this.state.locations;
        LocationServiceApi.getAllLocations().then(res => {
            res.data.forEach(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address,
                    name: location.name
                }
                locationArray.push(locationObject);
                this.setState({ locations: locationArray });
                // console.log(this.state.locations);
            });
        });
    }

    render() {
        // console.log(this.state.locations)
        return (
            <div div className='bodydashbord' style={{ paddingTop: "10px" }}>
                <h2 className='title'>Search for a car</h2>
                <div style={{ margin: "auto", marginBottom: "4%", color: "black", width: "900px", backgroundColor: "rgba(41, 39, 39, 0.3)", boxShadow: "0 5px 30px black" }}>
                    {this.state.popUp && <BookingConfirmDetailsPopUp locations={this.state.locations} car={this.state.selectedCar} pickupTime={this.state.pickupTime} returnTime={this.state.returnTime} togglePopUp={this.togglePopUp} />}
                    {this.state.errorMessage && <Alert style={{ backgroundColor: "rgba(41, 39, 39, 0.3)", boxShadow: "0 5px 30px black", color: "white" }} variant="danger">
                        <Alert.Heading>Error filtering cars!</Alert.Heading>
                        <p>
                            {this.state.errorMessage}
                        </p>
                    </Alert>}
                    <div>
                        <Form onSubmit={this.handleSubmitFilter} id="filter_form" style={{ display: "flex", justifyContent: "space-between", color: "white" }} >
                            <Form.Group controlId="formHorizontalFirstName">
                                <div style={{ marginLeft: "30px", marginRight: "-40px", width: "200px" }}>
                                    Make
                                    <Form.Control name="make" type="text" placeholder="Make" onChange={this.handleChange} style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "75%", transition: ".2s" }} />
                                </div>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <div className='formcontrolwraper' style={{ width: "75px" }}>
                                    Seats
                                    <Form.Control name="seats" as="select" onChange={this.handleChange} style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", fontWeight: 700, width: "100%", transition: ".2s" }}>
                                        <option>Any</option>
                                        {CAR_SEATS.map(carSeat =>
                                            <>
                                                <option>{carSeat}</option>
                                            </>
                                        )}
                                    </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <div className='formcontrolwraper' >
                                    Fuel Type
                                    <Form.Control name="fueltype" as="select" onChange={this.handleChange} style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", fontWeight: 700, width: "100%", transition: ".2s" }}>
                                        <option>Any</option>
                                        {CAR_FUEL_TYPES.map(carFuel =>
                                            <>
                                                <option>{carFuel}</option>
                                            </>
                                        )}
                                    </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <div className='formcontrolwraper' >Body Type
                                    <Form.Control name="bodytype" as="select" onChange={this.handleChange} style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", fontWeight: 700, width: "100%", transition: ".2s" }}>
                                        <option>Any</option>
                                        {CAR_BODY_TYPES.map(carBodyType =>
                                            <>
                                                <option>{carBodyType}</option>
                                            </>
                                        )}
                                    </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <div className='formcontrolwraper' >Colour
                                    <Form.Control name="colour" as="select" onChange={this.handleChange} style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", fontWeight: 700, width: "100%", transition: ".2s" }}>
                                        <option>Any</option>
                                        {CAR_COLOURS.map(carColour =>
                                            <>
                                                <option>{carColour}</option>
                                            </>
                                        )}
                                    </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <div className='formcontrolwraper'>Location
                                    <Form.Control name="location" as="select" onChange={this.handleChange} style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", fontWeight: 700, width: "100%", transition: ".2s" }}>
                                        <option>Any</option>
                                        {this.state.locations.map(location =>
                                            <>
                                                <option value={location.id}>{location.address + "," + location.name}</option>
                                            </>
                                        )}
                                    </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group>
                                <div>
                                    <Button style={{ width: "100%", height: "100%", backgroundColor: "rgba(41, 39, 39, 0.3)" }} type="submit">Filter Cars</Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <h2 className='title'>Available Cars from {new Date(this.state.pickupTime).toLocaleString()} till {new Date(this.state.returnTime).toLocaleString()}</h2>
                <div style={{ margin: "auto", display: "flex" }}>
                    <Container fluid>
                        <Row>
                            {this.state.availableCars.map(car =>
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
                                            style={{
                                                width: 220,
                                                height: 270,
                                                backgroundColor: "rgba(41, 39, 39, 0.3)",
                                                boxShadow: "0 5px 30px black",
                                                color: "white",
                                                padding: 0,
                                                marginBottom: "20px",
                                                borderTopLeftRadius:0,
                                                borderTopRightRadius:0
                                            }}
                                        >
                                            <div style={{ marginTop: "-24.5px", marginLeft: "-24.5px" }}>

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
                                                    <div style={{ marginTop: "-19px", marginLeft: "-4px" }}>
                                                        {this.state.locations.map(location =>
                                                            <>
                                                                {location.id === car.location &&
                                                                    <>
                                                                        <p style={{ fontSize: "15px" }}><VscLocation style={{ fontSize: "16px" }} />{location.address}</p>
                                                                    </>
                                                                }
                                                            </>
                                                        )}

                                                    </div>
                                                </div>
                                                <div style={{ marginTop: "-16px", marginLeft: "-10px" }}>
                                                    <Link to={{
                                                        pathname: '/booking_confirm',
                                                        state: {
                                                            locations: this.state.locations,
                                                            car: car,
                                                            pickupTime: this.state.pickupTime,
                                                            returnTime: this.state.returnTime,
                                                        }
                                                    }} >
                                                        <Button style={{ background: "linear-gradient(315deg, #ffbc00, #ff0058)", }}>
                                                            Book
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr style={{ marginTop: "4px", width: "200px", marginLeft: "-25px" }} />
                                            <div style={{ marginTop: "-11px", fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                                                <div>{car.seats}-Seater</div>
                                                <div>|</div>
                                                <div>{this.state.locations.map(location =>
                                                    <div key={car.id}>
                                                        {location.id === car.location &&
                                                            <>
                                                                {location.name}
                                                            </>
                                                        }
                                                    </div>
                                                )}</div>
                                                <div>|</div>
                                                <div>{car.fueltype}</div>
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            )}
                        </Row>
                    </Container>
                </div>
                {/* <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Make</th>
                            <th>Seats</th>
                            <th>Body Type</th>
                            <th>Colour</th>
                            <th>Cost per hour</th>
                            <th>Fuel Type</th>
                            <th>Location</th>
                            <th>Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.availableCars.map(car =>
                            <tr key={car.id}>
                                {console.log(car)}
                                <td>{car.make}</td>
                                <td>{car.seats}</td>
                                <td>{car.bodytype}</td>
                                <td>{car.colour}</td>
                                <td>₹{car.costperhour}</td>
                                <td>{car.fueltype}</td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <div key={car.id}>
                                            {location.id === car.location &&
                                                <>
                                                    {location.name}
                                                </>
                                            }
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {this.state.locations.map(location =>
                                        <div key={location.id}>
                                            {location.id === car.location &&
                                                <>
                                                    {location.address}
                                                </>
                                            }
                                        </div >
                                    )}
                                </td>
                                <td>

                                    <Link to={{
                                        pathname: '/booking_confirm',
                                        state: {
                                            locations: this.state.locations,
                                            car: car,
                                            pickupTime: this.state.pickupTime,
                                            returnTime: this.state.returnTime,
                                        }
                                    }} >
                                        Book
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table> */}
            </div>
        )
    }
}

export default FilterCarsPage;
