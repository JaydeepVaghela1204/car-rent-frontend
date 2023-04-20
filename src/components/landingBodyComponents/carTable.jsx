import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import LocationServiceApi from '../../api/LocationServiceApi';

class CarTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            location: 'Any',
            locations: [],
            car: []
        };
    }

    componentDidMount() {
        const { car, pickupTime, returnTime } = this.props;

        this.setState({
            car: car,
            pickupTime: Object.values(pickupTime),
            returnTime: Object.values(returnTime)
        });

        let locationArray = this.state.locations;
        // console.log("locations",locationArray)
        LocationServiceApi.getAllLocations().then(res => {
            res.data.forEach(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address,
                    name: location.name
                }
                locationArray.push(locationObject);
                this.setState({ locations: locationArray });
                // console.log(this.state.locations)
            });
        });
    }

    render() {
        // const loc = [this.state.locations]
        // console.log(this.state.locations)
        const { car , pickupTime , returnTime } = this.state
        console.log("pickup",pickupTime);
        console.log("return",returnTime);
        
        return (
            <>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Make</th>
                            {/* <th>Seats</th> */}
                            <th>Body Type</th>
                            <th>Colour</th>
                            <th>Cost per hour</th>
                            <th>Fuel Type</th>
                            <th>Location</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>                   
                            <tr key={car.id}>
                                <td>{car.make}</td>
                                {/* <td>{car.seats}</td> */}
                                <td>{car.bodytype}</td>
                                <td>{car.colour}</td>
                                <td>₹{car.costperhour}</td>
                                <td>{car.fueltype}</td>
                                <td>{car.location}</td>
                                <td>

                                    <Link to={{
                                        pathname: '/booking_confirm',
                                        state: {
                                            locations: this.state.locations,
                                            car: car,
                                            pickupTime: pickupTime,
                                            returnTime: returnTime,
                                        }
                                    }} >
                                            Book
                                    </Link>
                                </td>
                            </tr>
                    </tbody>
                </Table>
            </>
        )
    }
}

export default CarTable;