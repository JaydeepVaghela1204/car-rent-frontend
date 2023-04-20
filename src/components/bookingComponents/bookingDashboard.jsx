/* Booking dashboard */
import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import CarServiceApi from '../../api/CarServiceApi';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import { CheckCircleOutlined,SyncOutlined } from '@ant-design/icons';
import { Tag, Card } from 'antd';
import { FaArrowRight } from "react-icons/fa";
import { BiTransfer, BiTransferAlt } from 'react-icons/bi';
import './dashbord.css';
import Footer from '../footer';

class BookingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            errorMessage: '',
            nextBooking: {},
            nextBookingExists: false,
            car: '',
            img: [],
            location: '',
            successHeader: '',
            successMsg: '',
            availablePickup: false,
            avaialbleReturn: false,
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePickupButton = this.handlePickupButton.bind(this);
        this.handleReturnButton = this.handleReturnButton.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        // check for available cars and redirect
        let newSearch = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime
        };
        // publish search all available cars request to backend
        CarServiceApi.searchAvailableCars(newSearch).then(res => {
            // console.log(res)
            // passing available cars to filter car page
            this.props.updateCars(res.data.availableCars, this.state.pickupTime, this.state.returnTime);
            this.props.history.push('/filter');
        }).catch((error) => {
            // display error if there's any
            this.setState({ errorMessage: error.response.data.message });
        });
    };

    handlePickupButton() {
        // change booking status to picked up
        let nextBooking = this.state.nextBooking;
        nextBooking.status = 'Picked up';
        nextBooking.id = nextBooking._id;
        this.setState({
            nextBooking: nextBooking
        });
        // update booking object in database
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successHeader: 'Pickup success!',
                    successMsg: "Car has been picked up! Please return it before your specified return time.",
                    availablePickup: false,
                    avaialbleReturn: true
                });
            });
    }

    // mapOnMarkerClick = (props, marker) =>
    //     this.setState({
    //         selectedPlace: props,
    //         activeMarker: marker,
    //         showingInfoWindow: true,
    //     });

    // mapOnMapClick = () =>
    //     this.setState({
    //         showingInfoWindow: false,
    //         selectedPlace: {},
    //         activeMarker: {}
    //     });

    handleReturnButton() {
        // change booking status to returned
        let nextBooking = this.state.nextBooking;
        nextBooking.status = 'Returned';
        nextBooking.id = nextBooking._id;
        this.setState({
            nextBooking: nextBooking
        });
        // update booking object in database
        BookingServiceApi.modifyBooking(this.state.nextBooking)
            .then(() => {
                this.setState({
                    successHeader: 'Return success!',
                    successMsg: "Car has been returned! Thanks for using Anonymous Car Share!",
                    avaialbleReturn: false
                })
            })
    }

    componentDidMount() {
        // obtain customer's upcoming booking  with required elements if any
        BookingServiceApi.getNextBooking().then(res => {
            if (Object.keys(res.data).length) {
                // display upcoming booking and show pickup/return button when available
                let currentTime = new Date();
                currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
                this.setState({
                    nextBooking: res.data,
                    nextBookingExists: true,
                    availablePickup: (!(new Date(res.data.pickuptime) > currentTime) && res.data.status === "Confirmed"),
                    avaialbleReturn: res.data.status === "Picked up"
                });
                CarServiceApi.getCar(res.data.car)
                    .then(res => {
                        this.setState({
                            car: res.data.car,
                            img: res.data.car.image
                        });
                    });
                LocationServiceApi.getLocationFromId(res.data.location)
                    .then(res => {
                        if (res) {
                            LocationServiceApi.getGeocodeFromAddress(res.data.address)
                                .then(newRes => {
                                    console.log("NEW RES", newRes);
                                    // Create object with address, latitude and longitude
                                    let locationObject = {
                                        id: res.data._id,
                                        address: res.data.address,
                                        name: res.data.name,
                                        // lat: newRes.data.results[0].geometry.location.lat,
                                        // lng: newRes.data.results[0].geometry.location.lng,
                                        cars: res.data.cars
                                    };

                                    // set new location object to react state array
                                    this.setState({
                                        location: locationObject,
                                        isLoading: true
                                    });
                                });
                        }
                    });
            }
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div className='bodydashbord' style={{ paddingTop: "10px" }}>
                {this.state.successMsg &&
                    <Alert style={{ backgroundColor: "rgba(41, 39, 39, 0.3)", boxShadow: "0 5px 30px black", color: "white" }} variant="success">
                        <Alert.Heading>{this.state.successHeader}</Alert.Heading>
                        <p>
                            {this.state.successMsg}
                        </p>
                    </Alert>
                }
                {this.state.nextBookingExists &&
                    <div className="white-cards-div">
                        <div>
                            <div className='title'>Your upcoming booking: </div>
                            {/* {this.state.isLoading && <div id="garage-map" style={{ height: '400px' }}>
                                <Map google={this.props.google}
                                    initialCenter={{
                                        lat: this.state.location.lat,
                                        lng: this.state.location.lng
                                    }}
                                    style={{ height: '400px', width: '400px' }}
                                    zoom={14}
                                    onClick={this.mapOnMapClick}>

                                    <Marker
                                        id={this.state.location.id}
                                        name={this.state.location.name}
                                        address={this.state.location.address}
                                        onClick={this.mapOnMarkerClick}
                                        position={{ lat: this.state.location.lat, lng: this.state.location.lng }}
                                    />

                                    <InfoWindow
                                        onClose={this.onInfoWindowClose}
                                        marker={this.state.activeMarker}
                                        visible={this.state.showingInfoWindow}>
                                        <div id="info-window">
                                            <h2>{this.state.selectedPlace.name}</h2>
                                            <p>{this.state.selectedPlace.address}</p>
                                            <a href={"/locations/" + this.state.selectedPlace.id}>Check out this location</a>
                                        </div>
                                    </InfoWindow>
                                </Map>
                            </div>} */}
                            <div>
                                <Card className='carddata'
                                    title="Upcoming Booking"
                                    bordered={false}
                                    headStyle={{ color: "white" }}
                                    style={{
                                        width: 490,
                                        backgroundColor: "rgba(41, 39, 39, 0.3)",
                                        boxShadow: "0 5px 30px black",
                                        margin: "auto",
                                        marginBottom: "10px",
                                        borderRadius: 0
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <div className='detail'>Car Detail</div>
                                            <div>
                                                {/* <img style={{ borderRadius: 0 }} src={this.state.car.image} alt="car" height="100" width="150" /> */}
                                                <img style={{ borderRadius: 0 }} src={this.state.img[0]} alt="" width={150} height={90} />
                                                {console.log(this.state.car.image)}
                                            </div>
                                            <div className='subtitle'>
                                                <div>Number Plate: {this.state.car.numberplate}</div>
                                                <div>{this.state.car.make},{this.state.car.fueltype},{this.state.car.bodytype},{this.state.car.seats} seaters,{this.state.car.colour}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className='detail'>Booking Detail</div>
                                            <div className='subdetail'>
                                                <div>Recipt:{this.state.nextBooking._id}</div>
                                                <div>Booking-Date:{new Date(this.state.nextBooking.bookedtime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                                <div style={{ display: "flex", fontSize: "12px",justifyContent:"space-between" }}>
                                                    <div style={{ width:"40%"}}>From:{new Date(this.state.nextBooking.pickuptime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                                    <BiTransfer style={{ marginTop:"4%"}} />
                                                    <div style={{ width:"40%"}}>To:{new Date(this.state.nextBooking.returntime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                                </div>
                                                <div>Cost:₹{this.state.nextBooking.cost}</div>
                                                <div>Location:{this.state.location.name}</div>
                                                <div>Address:{this.state.location.address}</div>
                                                <div>Status:{this.state.nextBooking.status === "Confirmed" || this.state.nextBooking.status === "Returned" ? <Tag icon={<CheckCircleOutlined />} color="success">{this.state.nextBooking.status}</Tag> : <Tag icon={<SyncOutlined spin />} color="processing">{this.state.nextBooking.status}</Tag>}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "7px", display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            {this.state.nextBooking.status === "Confirmed" ? <Button style={{ marginLeft: "90px", backgroundColor: "rgba(41, 39, 39, 0.3)" }} variant="success" onClick={this.handlePickupButton} disabled={!this.state.availablePickup}>Pickup</Button> : <Button style={{ marginLeft: "90px", backgroundColor: "rgba(41, 39, 39, 0.3)" }} variant="danger" onClick={this.handleReturnButton} disabled={!this.state.avaialbleReturn}>Return</Button>}
                                        </div>
                                        <div>
                                            <Button style={{ marginRight: "90px", backgroundColor: "rgba(41, 39, 39, 0.3)" }} href={`/mybookings/${this.state.nextBooking._id}`}>View Booking</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                }
                <div className='title'>Let's find you a car!</div>
                <div style={{ margin: "auto", marginBottom: "4%", color: "black", width: "900px", backgroundColor: "rgba(41, 39, 39, 0.3)", boxShadow: "0 5px 30px black" }}>
                    {this.state.errorMessage && <Alert variant="danger" style={{ backgroundColor: "rgba(41, 39, 39, 0.3)", boxShadow: "0 5px 30px black", color: "white" }}>
                        <Alert.Heading>Error checking availability!</Alert.Heading>
                        <p>
                            {this.state.errorMessage}
                        </p>
                    </Alert>}
                    <div>
                        <Form onSubmit={this.handleSubmit} id="availability_form" style={{ display: "flex", justifyContent: "space-between", color: "white" }} >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Form.Group controlId="formHorizontalFirstName">
                                    <div style={{ marginLeft: "30px", marginRight: "20px" }}>
                                        From
                                        <Form.Control style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "100%", transition: ".2s" }} name="pickupTime" type="datetime-local" onChange={this.handleChange} required />
                                    </div>
                                </Form.Group>

                                <BiTransferAlt style={{ marginTop: "4%", width: "30px", height: "30px" }} />

                                <Form.Group controlId="formHorizontalLastName">
                                    <div style={{ marginLeft: "30px", marginRight: "20px" }}>
                                        To
                                        <Form.Control style={{ color: "white", border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "100%", transition: ".2s" }} name="returnTime" type="datetime-local" onChange={this.handleChange} required />
                                    </div>
                                </Form.Group>
                            </div>

                            <Form.Group>
                                <div style={{ marginLeft: "30px", marginRight: "20px", paddingTop: "20px" }}>
                                    <Button type="submit" style={{ width: "100%", height: "100%", backgroundColor: "rgba(41, 39, 39, 0.3)" }}>Booking Now
                                        <FaArrowRight />
                                    </Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        )
    }
}

// export default GoogleApiWrapper({
//     apiKey: process.env.REACT_APP_API_KEY
// })(BookingDashboard);

export default BookingDashboard;