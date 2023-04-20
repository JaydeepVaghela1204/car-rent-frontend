/* View customer bookings page */
import React, { Component } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import BookingServiceApi from '../../api/BookingServiceApi';
import { RiCalendarCheckLine } from 'react-icons/ri'

const { default: LocationServiceApi } = require("../../api/LocationServiceApi");
const { default: CarServiceApi } = require("../../api/CarServiceApi");

export default class ViewCustomerBookingsPage extends Component {
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
        // get all of customer's bookings details by user id and also required elements
        BookingServiceApi.getUserBookings(this.props.match.params.id).then(res => {
            this.setState({
                // sort bookings by latest
                bookings: res.data.bookings.reverse()
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        })
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
                })
            }).catch((error) => {
                this.setState({ errorMessage: error.response.data.message });
            });
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
                    <Alert.Heading>Error fetching customer's bookings!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2>Bookings for Customer {this.props.match.params.id}</h2>
                <Button href={`/admin/view/customers/${this.props.match.params.id}`}>View Customer Profile</Button>
                {(this.state.bookings).length === 0 ?
                    <div style={{ marginTop:"5%" , textAlign: "center" }}>
                        <RiCalendarCheckLine style={{ height: "200px", width: "200px", }}></RiCalendarCheckLine>
                        <div>Customer haven't made any booking yet!</div>
                    </div>
                    :
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>Booking ID</th> */}
                                    <th>Sr No</th>
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
                                    <tr>
                                        {/* <td>{booking.id}</td> */}
                                        <td>{index + 1}</td>
                                        <td>{new Date(booking.bookedtime).toLocaleString()}</td>
                                        <td>{new Date(booking.pickuptime).toLocaleString()}</td>
                                        <td>{new Date(booking.returntime).toLocaleString()}</td>
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
        )
    }
}
