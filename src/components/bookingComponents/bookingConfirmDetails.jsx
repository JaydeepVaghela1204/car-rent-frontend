/* Bookings confirm details page */
import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import BookingServiceApi from '../../api/BookingServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import PaymentServiceApi from '../../api/PaymentServiceApi';
import { MdLocationPin } from 'react-icons/md';
import { IoEarth } from 'react-icons/io5';
import '../../styles/bookingConfirm.css';
import { Card } from 'antd';
import SimpleImageSlider from "react-simple-image-slider";


class BookingConfirmDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            location: {},
            activeMarker: {},
            showingInfoWindow: false,
            selectedPlace: {},
            isLoading: false,
        };
        this.handleConfirmButton = this.handleConfirmButton.bind(this);
        this.handleCancelButton = this.handleCancelButton.bind(this);
    }

    handleConfirmButton = event => {

        event.preventDefault();
        // const loc = this.props.location.state.car.location === "Surat" ? this.props.location.state.car.locationId : this.props.location.state.car.location;
        const d_loc = this.props.location.state.car.location;
        const c_loc = this.props.location.state.car.locationId;
        const loc = c_loc === undefined ? d_loc : c_loc;
        const did = this.props.location.state.car._id;
        const cid = this.props.location.state.car.id;
        const id = did === undefined ? cid : did;

        let newBooking = {
            pickupTime: this.props.location.state.pickupTime,
            returnTime: this.props.location.state.returnTime,
            user: UserServiceApi.getLoggedInUserID(),
            car: id,
            location: loc,
        };
        // publish create booking request to backend
        BookingServiceApi.createBooking(newBooking)
        // .then(res => {
        //     // redirect to booking details page on success
        //     window.location.href = `/mybookings/${res.data.response.booking._id}`;
        // }).catch((error) => {
        //     // display error message on failure
        //     this.setState({ errorMessage: error.response.data.message });
        // })

        const { car } = this.props.location.state;

        const cost = this.calculateBookingCost();

        const payment = {
            userId: UserServiceApi.getLoggedInUserID(),
            Items: [{
                currency: "inr",
                name: `${car.make} ${car.bodytype} ${car.seats}seater`,
                unit_amount: cost,
                quantity: 1,
                // image : "C:/Users/ujjval/Downloads/pp-car-share-master1/pp-car-share-master/frontend/public/favicon.ico"
            }]
        }

        PaymentServiceApi.createPayment(payment).then(res => {
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        }).catch(error => console.log(error))
    };

    handleCancelButton = event => {
        // prevent browser from refreshing on click
        // event.preventDefault();
        this.props.history.goBack();
        // this.props.togglePopUp();
    };

    componentDidMount() {
        // const { car } = this.props;
        const { car } = this.props.location.state;

        // obtain location from id
        // LocationServiceApi.getLocationFromId(car.location)
        LocationServiceApi.getLocationFromId(car)
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
                            }
                            // set new location object to react state array
                            this.setState({
                                location: locationObject,
                                isLoading: true
                            })
                        });
                }
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

    calculateBookingCost() {
        // cost calculation based on pickup time and return time difference
        // const pickupTimeHours = new Date(this.props.pickupTime);
        // const returnTimeHours = new Date(this.props.returnTime);
        // const timeDeltaHours = new Date(returnTimeHours - pickupTimeHours).getTime() / 3600;
        // const cost = parseInt(this.props.car.costperhour) * (timeDeltaHours / 1000);
        // return cost.toFixed(2);

        const pickupTimeHours = new Date(this.props.location.state.pickupTime);
        const returnTimeHours = new Date(this.props.location.state.returnTime);
        const timeDeltaHours = new Date(returnTimeHours - pickupTimeHours).getTime() / 3600;
        const cost = parseInt(this.props.location.state.car.costperhour) * (timeDeltaHours / 1000);
        return cost.toFixed(2);
    }

    render() {
        // const { locations, car, pickupTime, returnTime } = this.props;
        const { locations, car, pickupTime, returnTime } = this.props.location.state;
        const cost = this.calculateBookingCost();
        console.log("cost", cost)

        return (
            <>
                <div>
                    {this.state.errorMessage && <Alert variant="danger">
                        <Alert.Heading>Booking failed!</Alert.Heading>
                        <p>
                            {this.state.errorMessage}
                        </p>
                    </Alert>}
                    <h2 style={{ textAlign: "center" }}>Confirm Booking?</h2>
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
                            <b>Pickup time: </b> {new Date(pickupTime).toLocaleString()} <br></br>
                            <b>Return time: </b> {new Date(returnTime).toLocaleString()} <br></br>
                            <b>Cost: </b> ₹{cost} <br></br>
                            <b>Location: </b> {locations.map(location =>
                                <>
                                    {location.id === (car.locationId || car.location) &&
                                        <>
                                            {location.name}
                                        </>
                                    }
                                </>
                            )} <br></br>
                            <b>Address: </b> {locations.map(location =>
                                <>
                                    {location.id === (car.locationId || car.location) &&
                                        <>
                                            {location.address}
                                        </>
                                    }
                                </>
                            )}
                        </div>


                        <Col sm={7}>
                            <div className="cars-div-white">
                                <img src={car.image} alt="car" width="70%" />
                                <h2 style={{ marginTop: '1vh' }}>{car.make}</h2>
                                <p>{car.fueltype}, {car.bodytype}, {car.seats} seaters, {car.colour}</p>
                                <h5>₹{car.costperhour} per hour</h5>
                                <strong>Location:{locations.map(location =>
                                    <>
                                        {location.id === (car.locationId || car.location) &&
                                            <>
                                                {location.address}
                                            </>
                                        }
                                    </>
                                )}</strong>
                                <div style={{ justifyContent: "center" }}>
                                    <Button variant="success" onClick={this.handleConfirmButton}>Confirm</Button>
                                    <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                                </div>
                            </div>
                        </Col>
                    </div> */}
                    <div style={{ display: "flex" }}>
                        <div style={{ marginLeft: "5%" }}>
                            <Card
                                title="Booking Details"
                                hoverable
                                style={{
                                    width: 250,
                                }}
                            >
                                <div style={{ fontWeight: "bolder", fontSize: "15px" }}>Time and Place</div>
                                <div>
                                    <div className='booking_detail'>
                                        <div>Pick-up:</div>
                                        <div>{new Date(pickupTime).toLocaleString()}</div>
                                    </div>
                                    <div className='booking_detail'>
                                        <div>Return:</div>
                                        <div>{new Date(returnTime).toLocaleString()}</div>
                                    </div>
                                    <div className='booking_detail'>
                                        <div>Cost Per hours:</div>
                                        <div>₹{car.costperhour}</div>
                                    </div>
                                    <div className='booking_detail'>
                                        <div>Total Cost:</div>
                                        <div>₹{cost}</div>
                                    </div>
                                    <div className='booking_detail'>
                                        <div>Location:</div>
                                        <div>{locations.map(location =>
                                            <>
                                                {location.id === (car.locationId || car.location) &&
                                                    <>
                                                        <IoEarth></IoEarth>{location.name}
                                                    </>
                                                }
                                            </>
                                        )}</div>
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
                                    <div style={{ padding : "19px"}}>
                                        {/* <img style={{ borderRadius: 0 }} src={car.image} alt="" height={100} /> */}
                                        <SimpleImageSlider
                                            width="220px"
                                            height="130px"
                                            images={car.image.map((images, index) =>
                                                images
                                            )
                                            }
                                            // showBullets={true}
                                            // showNavs={true}
                                            // autoPlay
                                            style={{
                                                borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                                            }}
                                        />
                                    </div>

                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "20px", fontWeight: "bolder" }}>{car.make}</div>
                                        <div><MdLocationPin />{locations.map(location =>
                                            <>
                                                {location.id === (car.locationId || car.location) &&
                                                    <>
                                                        {location.address}
                                                    </>
                                                }
                                            </>
                                        )},{locations.map(location =>
                                            <>
                                                {location.id === (car.locationId || car.location) &&
                                                    <>
                                                        {location.name}
                                                    </>
                                                }
                                            </>
                                        )}</div>
                                        <div>
                                            <div style={{ fontSize: "10px", marginTop: "10%" }}>Description:{car.fueltype},{car.bodytype},{car.seats} seaters,{car.colour}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ textAlign: "center", borderRadius: 3, border: "1px solid", padding: "10px" }}>
                                            <div>Total Price:</div>
                                            <div>₹{cost}</div>
                                        </div>

                                        <div style={{ marginTop: "5px", display: "flex" }}>
                                            <div>
                                                <Button variant="success" onClick={this.handleConfirmButton}>Confirm</Button>
                                            </div>
                                            <div style={{ marginLeft: 2 }}>
                                                <Button variant="danger" onClick={this.handleCancelButton}>Cancel</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

// export default GoogleApiWrapper({
//     apiKey: process.env.REACT_APP_API_KEY
// })(BookingConfirmDetailsPopUp);

export default BookingConfirmDetailsPopUp;