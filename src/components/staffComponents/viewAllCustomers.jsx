/* View all customers page */
import React, { Component } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { GrUserManager } from 'react-icons/gr'

const { default: UserServiceApi } = require("../../api/UserServiceApi");

export default class ViewAllCustomersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        // fetch all customers
        UserServiceApi.getAllCustomers().then(res => {
            this.setState({
                customers: res.data.customers.reverse()
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error obtaining customers!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <h2 style={{ textAlign: "center" }}>View All Customers</h2>
                {(this.state.customers).length === 0 ?
                    <div style={{ marginTop: "5%", textAlign: "center" }}>
                        <GrUserManager style={{ height: "200px", width: "200px", }}></GrUserManager>
                        <div>No Customer yet!</div>
                    </div>
                    :
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {/* <th>Customer ID</th> */}
                                    <th>Sr No</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.customers.map((customer, index) =>
                                    <tr key={customer.id}>
                                        {/* <td>{customer.id}</td> */}
                                        <td>{index + 1}</td>
                                        <td>{customer.firstname}</td>
                                        <td>{customer.lastname}</td>
                                        <td>{customer.email}</td>
                                        <td><Button href={`/admin/view/customers/${customer.id}`}>View</Button></td>
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
