/* landing page component */
import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import LandingBody from './landingBody';
import UserServiceApi from '../api/UserServiceApi';

class LandingPage extends Component {
    render() {
        const isUserLoggedIn = UserServiceApi.isUserLoggedIn();
        const isUserStaff = UserServiceApi.isUserStaff();
        return (
            <>
                <Container id="landing-page" fluid>
                    <div id="catchphrase">
                        <h1>Anonymous Car Share.</h1>
                        <h4>You don't need to own a car to drive one.</h4>

                        {(isUserLoggedIn && !isUserStaff) &&
                            <>
                                <Link to="/dashboard">
                                    <Button variant="warning" style={{ fontSize: '2vh', color: 'white', backgroundColor: '#ff071e' }}>Dashboard</Button>
                                </Link>
                            </>
                        }
                        {(isUserLoggedIn && isUserStaff) &&
                            <>
                                <Link to="/staff">
                                    <Button variant="warning" style={{ fontSize: '2vh' }}>Manage System</Button>
                                </Link>
                            </>
                        }
                        {!isUserLoggedIn &&
                            <>
                                <Link to="/signup">
                                    <Button variant="warning" style={{ fontSize: '2vh', color: 'white', backgroundColor: '#ff071e' }}>Sign Up Now</Button>
                                </Link>
                            </>
                        }
                    </div>
                </Container>
                <Container style={{ background:"#f8f9fa" }} id="landing-main" fluid>
                    <LandingBody />
                </Container>
                <div className="footer-parent">
                    <div className="footer" style={{ backgroundColor: '#343a40', width: '100%', color: 'white', position: 'relative', left: 0, bottom: 0, right: 0 }}>
                        <p>Email us: <a href="mailto:anonymous@carshare.com">anonymous@carshare.com</a></p>
                        <p>Call us: ((0261) 253 772)</p>
                        <p>Visit us: Anonymous Car Share, Sumul Dairy Road</p>
                    </div>
                </div>
            </>
        )
    }
}

export default LandingPage;