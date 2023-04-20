/* My profile page for customers */
import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi';
import BookingServiceApi from '../api/BookingServiceApi';
import profile from '../assets/black.png';
import '../styles/profile.css'

// const { default: UserServiceApi } = require("../api/UserServiceApi");

class MyProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: []
        };
        this.getUsersBookings = this.getUsersBookings.bind(this);
    }

    componentDidMount() {
        this.getUsersBookings();
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

    render() {
        const userData = UserServiceApi.getLoggedInUserDetails();
        return (
            <div style={{ backgroundColor: "#131111" , padding: "40px 0 0" }}>
                <Container style={{ margin:"auto" ,textAlign: "-webkit-center"}}>
                    <div class="container">
                        <div class="box">
                            <span></span>
                            <div class="content">
                                <h2>Profile</h2>
                                <div>
                                    <img src={profile} alt="profile" width={100} height={100} />
                                </div>
                                <div>
                                    <p>ID:{userData.id}</p>
                                    <p>Name:{userData.firstname} {userData.lastname} </p>
                                    <p>Email:{userData.email}</p>
                                    <p>My Booking:{(this.state.bookings).length === 0 ? "(⌣́_⌣̀)" : (this.state.bookings).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <div className="footer-parent" style={{ paddingTop : "50px"}}>
                    <div className="footer" style={{ backgroundColor: "#343a40", width: "100%", color: "white", padding: "3vh", position: "relative", left: 0, bottom: 0, right: 0 }}>
                        <p>Email us: <a href="mailto:anonymous@carshare.com">anonymous@carshare.com</a></p>
                        <p>Call us: ((0261) 253 772)</p>
                        <p>Visit us: Anonymous Car Share, Sumul Dairy Road</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyProfilePage;
