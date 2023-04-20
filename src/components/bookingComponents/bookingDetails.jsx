/* Bookings details page */
import React, { Component } from 'react';
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Alert, Button } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md'
import { IoEarth } from 'react-icons/io5';
import { Card } from 'antd';
import '../../styles/bookingConfirm.css';
// import SimpleImageSlider from "react-simple-image-slider";

class BookingDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            booking: {},
            car: {},
            img: [],
            errorMessage: '',
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false
        };
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.getBookingDetails = this.getBookingDetails.bind(this);
        this.checkBookingPast = this.checkBookingPast.bind(this);
    }

    getBookingDetails() {
        // obtain a user's booking by booking id and also car and location associated
        BookingServiceApi.getUserBooking(this.props.match.params.id).then(res => {
            // console.log("booking",res.data.booking)
            this.setState({
                booking: res.data.booking
            });
            CarServiceApi.getCar(this.state.booking.car)
                .then(res => {
                    this.setState({
                        car: res.data.car,
                        img: res.data.car.image
                    })
                });
            LocationServiceApi.getLocationFromId(this.state.booking.location)
                .then(res => {
                    if (res) {

                        LocationServiceApi.getGeocodeFromAddress(res.data.address)
                            .then(newRes => {
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
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
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

    componentDidMount() {
        this.getBookingDetails();
    }

    handleCancelButton() {
        // modify booking status to cancelled
        let booking = this.state.booking;
        booking.status = 'Cancelled';
        booking.id = booking._id;
        this.setState({
            booking: booking
        });
        BookingServiceApi.modifyBooking(this.state.booking)
            .then(() => {
                this.getBookingDetails()
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    checkBookingPast(pickupTime) {
        // check if booking pickup time has past current time
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
        return new Date(pickupTime) > currentTime;
    }

    render() {
        // const images = [
        //     this.state.img[0]
        // ]
        return (
            <div>
                <h2 style={{ textAlign: "center" }}><strong>Booking details</strong></h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining booking!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                {/* {!this.state.errorMessage && */}

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
                {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <b>Booking ID: </b> {this.state.booking._id} <br></br>
                        <b>Booking time: </b> {new Date(this.state.booking.bookedtime).toLocaleString('en-GB', { timeZone: 'GMT' })} <br></br>
                        <b>Pickup time: </b> {new Date(this.state.booking.pickuptime).toLocaleString('en-GB', { timeZone: 'GMT' })} <br></br>
                        <b>Return time: </b> {new Date(this.state.booking.returntime).toLocaleString('en-GB', { timeZone: 'GMT' })} <br></br>
                        <b>Cost: </b> ₹{this.state.booking.cost} <br></br>
                        <b>Location: </b> {this.state.location.name} <br></br>
                        <b>Address: </b> {this.state.location.address} <br></br>
                        <b>Status: </b> {this.state.booking.status} <br></br>

                        {(this.state.booking.status === "Confirmed" && this.checkBookingPast(this.state.booking.pickuptime)) &&
                            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                        }
                    </div>
                    <Col sm={6}>
                        <div className="cars-div-white" style={{ 'border': 'solid black 2px', textAlign: "center" }}>
                            <img src={this.state.car.image} alt="car" width="300px" />
                            <h2 style={{ marginTop: '1vh' }}>{this.state.car.make}</h2>
                            <p>{this.state.car.fueltype}, {this.state.car.bodytype}, {this.state.car.seats} seaters, {this.state.car.colour}</p>
                            <h5>Number Plate: {this.state.car.numberplate}</h5>
                            <p><b>Car ID: </b>{this.state.car._id}</p>
                        </div>
                    </Col>
                </div> */}
                <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "2%" }}>
                        <Card
                            title="Booking Details"
                            hoverable
                            style={{
                                width: 290,
                            }}
                        >
                            <div style={{ fontWeight: "bolder", fontSize: "15px" }}>Time and Place</div>
                            <div>
                                <div className='booking_detail'>
                                    <div>BookingId:</div>
                                    <div>{this.state.booking._id}</div>
                                </div>
                                <div className='booking_detail'>
                                    <div>Booking-time:</div>
                                    <div>{new Date(this.state.booking.bookedtime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                </div>
                                <div className='booking_detail'>
                                    <div>Pickup-time:</div>
                                    <div>{new Date(this.state.booking.pickuptime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                </div>
                                <div className='booking_detail'>
                                    <div>Return-time:</div>
                                    <div>{new Date(this.state.booking.returntime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                </div>
                                <div className='booking_detail'>
                                    <div>Total Cost:</div>
                                    <div>₹{this.state.booking.cost}</div>
                                </div>
                                <div className='booking_detail'>
                                    <div>Location:</div>
                                    <div><IoEarth />{this.state.location.address},{this.state.location.name}</div>
                                </div>
                                <div className='booking_detail'>
                                    <div>Status:</div>
                                    <div>{this.state.booking.status}</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div style={{ marginLeft: "5%" }}>
                        <Card
                            hoverable
                            style={{
                                width: 650,
                            }}
                        >
                            <div style={{ marginLeft: "-25px", display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <img style={{ marginLeft : "15px", borderRadius: 0 }} src={this.state.img[0]} alt="" width={170} height={100} />
                                    {/* {console.log(this.state.img)} */}
                                    {/* <SimpleImageSlider
                                        width="220px"
                                        height="130px"
                                        images={images}
                                        // showBullets={true}
                                        // showNavs={true}
                                        autoPlay
                                        style={{
                                            borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                                        }}
                                    /> */}
                                </div>

                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "bolder" }}>{this.state.car.make}</div>
                                    <div><MdOutlineDirectionsCarFilled />{this.state.car.numberplate}</div>
                                    <div>
                                        <div style={{ fontSize: "10px", marginTop: "10%" }}>Description:{this.state.car.fueltype},{this.state.car.bodytype},{this.state.car.seats} seaters,{this.state.car.colour}</div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center", borderRadius: 3, border: "1px solid", padding: "10px" }}>
                                        <div>Total Price:</div>
                                        <div>₹{this.state.booking.cost}</div>
                                    </div>

                                    <div style={{ marginTop: "5px" }}>
                                        {(this.state.booking.status === "Confirmed" && this.checkBookingPast(this.state.booking.pickuptime)) &&
                                            <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                {/* } */}
            </div>
        )
    }
}

// export default GoogleApiWrapper({
//     apiKey: process.env.REACT_APP_API_KEY
// })(BookingDetailsPage);

export default BookingDetailsPage;