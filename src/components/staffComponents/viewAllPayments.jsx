import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import PaymentServiceApi from '../../api/PaymentServiceApi'

export default class ViewAllPaymentsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            payment: [],
            locations: [],
            cars: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        PaymentServiceApi.getAllPayments().then(res => {
            this.setState({
                payment: res.data.Data
            });
        }).catch(error => {
            console.log(error)
        });
    }

    render() {
        return (
            <div>
            {console.log("Payment",this.state.payment)}
                <h2>View All Payments</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>E-mail</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Transection</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                            this.state.payment.map(payment =>
                                <tr style={{ 'cursor': 'pointer' }} key={payment._id}>
                                    <td>{payment._id}</td>
                                    <td><a href={`/admin/view/customers/${payment.user_id}`}>{payment.user_id}</a></td>
                                    <td>{payment.name}</td>
                                    <td>{payment.email}</td>
                                    <td>₹{payment.amount_total}</td>
                                    <td>{payment.payment_status}</td>
                                    <td>{payment.payment_intent}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}