/* View all locations page */
import React, { Component } from 'react';
import { Table, Alert, Button } from 'react-bootstrap';
import LocationServiceApi from '../../api/LocationServiceApi';
import { GrMapLocation } from 'react-icons/gr'

export default class ViewAllLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        // get all locations
        LocationServiceApi.getAllLocations().then(res => {
            this.setState({
                locations: res.data
            });
        }).catch(error => {
            this.setState({
                errorMessage: error.response
            });
        });
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: "center" }}>All Locations</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error Getting all cars!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                {(this.state.locations).length === 0 ?
                    <div style={{ marginTop: "5%", textAlign: "center" }}>
                        <GrMapLocation style={{ height: "200px", width: "200px", }}></GrMapLocation>
                        <div>No location provider available!...</div>
                    </div>
                    :
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>name</th>
                                    <th>address</th>
                                    <th>Edit</th>
                                    {/* <th>View</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.locations.map((location, index) =>
                                        <tr style={{ 'cursor': 'pointer' }} key={location._id}>
                                            <td>{index + 1}</td>
                                            <td>{location.name}</td>
                                            <td>{location.address}</td>
                                            <td><Button href={`/admin/modify/location/${location._id}`}>Modify</Button></td>
                                            {/* <td><Button href={`/admin/view/location/${location._id}`}>View</Button></td> */}
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
