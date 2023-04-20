/* My bookings page */
import React, { Component } from 'react';
import { Card } from 'antd';
import { Alert, Button } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import UserServiceApi from '../../api/UserServiceApi';
import Footer from '../footer';
import { BiTransfer } from 'react-icons/bi';
import { RiCalendarCheckLine } from 'react-icons/ri';
import { MdOutlineLocationOn } from 'react-icons/md';
import SimpleImageSlider from "react-simple-image-slider";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './dashbord.css';

class MyBookingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            locations: [],
            cars: [],
            errorMessage: ''
        };
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.getUsersBookings = this.getUsersBookings.bind(this);
        this.checkBookingPast = this.checkBookingPast.bind(this);
    }

    componentDidMount() {
        this.getUsersBookings();
        // obtain all locations
        LocationServiceApi.getAllLocations()
            .then(res => {
                let locationArray = this.state.locations;
                res.data.forEach(location => {
                    let locationObject = {
                        id: location._id,
                        address: location.address,
                        name: location.name
                    };
                    locationArray.push(locationObject);
                    this.setState({ locations: locationArray });
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            })
        // obtain all cars
        CarServiceApi.getAllCars()
            .then(res => {
                this.setState({
                    cars: res.data.cars
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    getUsersBookings() {
        const userDetails = UserServiceApi.getLoggedInUserDetails();
        BookingServiceApi.getUserBookings(userDetails.id)
            .then(res => {
                this.setState({
                    // sort bookings by latest
                    bookings: res.data.bookings.reverse()
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    checkBookingPast(pickupTime) {
        // check if booking pickup time hjas passed current time
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
        return new Date(pickupTime) > currentTime;
    }

    handleCancelButton(booking) {
        booking.status = 'Cancelled';
        BookingServiceApi.modifyBooking(booking)
            .then(() => {
                this.getUsersBookings();
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    render() {
        return (
            <div className="area" style={{ background: "black" }} >
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining bookings!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2 className='booking_title'>My Bookings</h2>
                <div>
                    {(this.state.bookings).length === 0 ?
                        <div style={{ textAlign: "center", color: "white" }}>
                            <RiCalendarCheckLine style={{ height: "200px", width: "200px", }}></RiCalendarCheckLine>
                            <div>You haven't made your first booking yet!</div>
                            <div>All you need to do first book your car.</div>
                        </div>
                        : <div>
                            {this.state.bookings.map(booking =>
                                <div style={{ paddingBottom: "15px" }}>
                                    <Card
                                        hoverable
                                        size='large'
                                        style={{
                                            width: 900,
                                            height: 240,
                                            marginTop: 16,
                                            margin: "auto"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ marginTop: "0%", marginLeft: "12px" }}>
                                                <div style={{ fontSize: "20px", fontWeight: "bolder", marginLeft: "13px" }}>
                                                    {this.state.cars.map(car =>
                                                        <div key={car.id}>
                                                            {car.id === booking.car &&
                                                                <>
                                                                    {car.make}
                                                                </>
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    {this.state.cars.map(car =>
                                                        <div key={car.id}>
                                                            {car.id === booking.car &&
                                                                <>
                                                                    <Link to={{
                                                                        pathname: '/car_detail',
                                                                        state: {
                                                                            car: car,
                                                                        }
                                                                    }}>
                                                                        <SimpleImageSlider
                                                                            width="220px"
                                                                            height="130px"
                                                                            images={car.image.map((images, index) =>
                                                                                images
                                                                            )
                                                                            }
                                                                            // showBullets={true}
                                                                            autoPlay
                                                                            style={{
                                                                                borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                                                                            }}
                                                                        />
                                                                    </Link>
                                                                </>
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ margin: "auto" }}>
                                                <div style={{ display: "flex" }}>
                                                    <div style={{ fontSize: "20px", fontWeight: "bolder", marginLeft: "70px" }}>From</div>
                                                    <BiTransfer style={{ height: "25px", width: "50px", marginLeft: "50px" }} />
                                                    <div style={{ fontSize: "20px", fontWeight: "bolder", marginLeft: "50px" }}>To</div>
                                                </div>
                                                <div style={{ display: "flex" }}>
                                                    <div style={{ fontSize: "20px", fontWeight: "bolder" }}>{new Date(booking.pickuptime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                                    <div style={{ fontSize: "20px", fontWeight: "bolder", marginLeft: "20px" }}>{new Date(booking.returntime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                                </div>

                                            </div>
                                            <div>
                                                <div>
                                                    <div style={{ fontSize: "20px", fontWeight: "bolder", marginBottom: 0 }}>Cost</div>
                                                    <div style={{ paddingTop: "0", fontSize: "17px", fontWeight: "bolder" }}>₹{booking.cost}</div>
                                                </div>
                                                <div>
                                                    <Button style={{ background: "linear-gradient(315deg, #ffbc00, #ff0058)" }} href={`/mybookings/${booking.id}`}>View</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={{ marginTop: "10px", marginBottom: "15px" }} />
                                        <div style={{ paddingTop: 0, display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex" }}>
                                                <MdOutlineLocationOn style={{ fontSize: "15px" }} />
                                                <div style={{ fontSize: "smaller", display: "flex" }}>{this.state.locations.map(location =>
                                                    <div key={location.id}>
                                                        {location.id === booking.location &&
                                                            <div key={booking.id}>
                                                                {location.address}
                                                            </div>
                                                        }
                                                    </div>
                                                )},{this.state.locations.map(location =>
                                                    <div key={location.id}>
                                                        {location.id === booking.location &&
                                                            <>
                                                                {location.name}
                                                            </>
                                                        }
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "smaller" }}>Booked-time:{new Date(booking.bookedtime).toLocaleString('en-GB', { timeZone: 'GMT' })}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "smaller" }}>Status:{booking.status}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </div>}
                </div>
                <div>
                    <Footer />
                </div>

            </div>
        )
    }
}

export default MyBookingPage;
