/* View all bookings page */
import React, { Component } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import emptyimg from '../../assets/empty.png'
const { default: LocationServiceApi } = require("../../api/LocationServiceApi");
const { default: CarServiceApi } = require("../../api/CarServiceApi");


export default class ViewAllBookingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            locations: [],
            cars: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        // obtain all bookings, locations and cars for rendering
        BookingServiceApi.getAllBookings().then(res => {
            this.setState({
                // sort bookings by latest
                bookings: res.data.bookings.reverse()
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
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
        CarServiceApi.getAllCars()
            .then(res => {
                this.setState({
                    cars: res.data.cars
                });
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
    }

    render() {
        return (
            <div>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error fetching all bookings!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>View All Bookings</h2>
                <div>
                    {(this.state.bookings).length === 0 ?
                        <div style={{ textAlign:"center"}}>
                            <img src={emptyimg} alt="" height="400px" />
                        </div>
                        :
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        {/* <th>User ID</th> */}
                                        <th>Booked Time</th>
                                        <th>Pickup Time</th>
                                        <th>Return Time</th>
                                        <th>Car</th>
                                        <th>Cost</th>
                                        {/* <th>Location</th> */}
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bookings.map((booking, index) =>
                                        <tr key={booking.id}>
                                            <td>{index + 1}</td>
                                            {/* <td>{booking.user}</td> */}
                                            <td>{new Date(booking.bookedtime).toLocaleString('en-GB', { timeZone: 'GMT' })}</td>
                                            <td>{new Date(booking.pickuptime).toLocaleString('en-GB', { timeZone: 'GMT' })}</td>
                                            <td>{new Date(booking.returntime).toLocaleString('en-GB', { timeZone: 'GMT' })}</td>
                                            <td>
                                                {this.state.cars.map(car =>
                                                    <>
                                                        {car.id === booking.car &&
                                                            <>
                                                                <a href={`/admin/view/cars/${booking.car}`}>{car.make}</a>
                                                            </>
                                                        }
                                                    </>
                                                )}
                                            </td>
                                            <td>₹{booking.cost}</td>
                                            {/* <td>
                                    {this.state.locations.map(location =>
                                        <>
                                            {location.id === booking.location &&
                                                <>
                                                    <a href={`/admin/view/location/${booking.location}`}>{location.name}</a>
                                                </>
                                            }
                                        </>
                                    )}
                                </td> */}
                                            <td>
                                                {this.state.locations.map(location =>
                                                    <>
                                                        {location.id === booking.location &&
                                                            <>
                                                                {location.address}
                                                            </>
                                                        }
                                                    </>
                                                )}
                                            </td>
                                            <td>{booking.status}</td>
                                            <td>
                                                <Button href={`/admin/view/bookings/${booking.id}`}>View</Button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
