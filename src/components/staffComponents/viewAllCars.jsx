/* View all cars page */
import React, { Component } from 'react';
import { Table, Alert } from 'react-bootstrap';
import CarServiceApi from '../../api/CarServiceApi';
import LocationServiceApi from '../../api/LocationServiceApi';
import { withRouter } from 'react-router-dom';
import { BsCart4 } from 'react-icons/bs';

class ViewAllCars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: [],
            errorMessage: ''
        };
        this.viewCarDetails = this.viewCarDetails.bind(this);
    }

    viewCarDetails(id) {
        this.props.history.push(`/admin/view/cars/${id}`);
    }

    componentDidMount() {
        // fetch all cars
        CarServiceApi.getAllCars().then(res => {
            res.data.cars.forEach(car => {
                // fetch location details for each car
                LocationServiceApi.getLocationFromId(car.location).then(res => {
                    car.location = res.data.name;
                    car.locationId = res.data._id;
                    this.state.cars.push(car);
                    this.setState({
                        cars: this.state.cars
                    });
                });
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div>
                <h2>All cars, click row to view/modify.</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error Getting all cars!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                {(this.state.cars).length === 0 ?
                    <div style={{ marginTop: "5%", textAlign: "center" }}>
                        <BsCart4 style={{ height: "200px", width: "200px", }}></BsCart4>
                        <div>No car available yet!...</div>
                    </div>
                    :
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>id</th> */}
                                    <th>make</th>
                                    <th>seats</th>
                                    <th>body type</th>
                                    <th>number plate</th>
                                    <th>colour</th>
                                    <th>cost per hour</th>
                                    <th>fuel type</th>
                                    <th>location</th>
                                    <th>image</th>
                                    <th>current booking</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.cars.map((car, index) =>
                                        <tr style={{ 'cursor': 'pointer' }} onClick={() => this.viewCarDetails(car.id)} key={index}>
                                            {/* <td>{car.id}</td> */}
                                            <td>{car.make}</td>
                                            <td>{car.seats}</td>
                                            <td>{car.bodytype}</td>
                                            <td>{car.numberplate}</td>
                                            <td>{car.colour}</td>
                                            <td>{car.costperhour}</td>
                                            <td>{car.fueltype}</td>
                                            <td>{car.location}</td>
                                            <td><img style={{ borderRadius: 0 }} alt="car" src={car.image[0]} width={50} /></td>
                                            <td>{(car.currentbooking === null) ? "No booking" : car.currentbooking}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(ViewAllCars);
