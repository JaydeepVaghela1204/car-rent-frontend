/* login page */
import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js';
import { FaEnvelope, FaLock, FaChevronRight } from 'react-icons/fa';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /* Set react state for each input when user inputs something on login form */
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        // login button handler
        event.preventDefault();
        let creds = {
            email: this.state.email,
            password: this.state.password
        };
        // email validation
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === '') {
            return this.setState({ errorMessage: "E-mail can't be empty" });
        }
        else {
            if (!emailRegex.test(String(this.state.email).toLowerCase())) {
                return this.setState({ errorMessage: "Please enter a valid email!" });
            }
        }
        if (this.state.password === '') {
            return this.setState({ errorMessage: "Password can't be empty" });
        }
        // publish login details to backend
        UserServiceApi.loginUser(creds).then(res => {
            UserServiceApi.registerSuccessfulLoginForJwt(res.data.token);
            window.location.href = `/`;
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            // <div>
            //         {this.state.errorMessage && <Alert variant="danger">
            //             <Alert.Heading>Login failed!</Alert.Heading>
            //             <p>
            //                 {this.state.errorMessage}
            //             </p>
            //         </Alert>}
            //     <Form onSubmit={this.handleSubmit} id="login_form">
            //         <Form.Group as={Row} controlId="formHorizontalEmail">
            //             <Form.Label column sm={2}>
            //                 Email
            //             </Form.Label>
            //             <Col sm={10}>
            //                 <Form.Control name="email" type="email" placeholder="Email" onChange={this.handleChange} required />
            //             </Col>
            //         </Form.Group>

            //         <Form.Group as={Row} controlId="formHorizontalPassword">
            //             <Form.Label column sm={2}>
            //                 Password
            //             </Form.Label>
            //             <Col sm={10}>
            //                 <Form.Control name="password" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters" placeholder="Password" onChange={this.handleChange} required />
            //             </Col>
            //         </Form.Group>

            //         <Form.Group as={Row}>
            //             <Col sm={{ span: 10, offset: 2 }}>
            //                 <Button type="submit" style={{ borderColor: '#ffc107', color: 'white', backgroundColor: '#ff071e' }}>Login</Button>
            //             </Col>
            //         </Form.Group>
            //     </Form>
            //     <div className="footer-parent">
            //         <div className="footer" style={{ backgroundColor: "#343a40",width: "100%",color: "white",padding: "3vh",position: "absolute",left: 0,bottom: 0,right: 0}}>
            //             <p>Email us: <a href="mailto:anonymous@carshare.com">anonymous@carshare.com</a></p>
            //             <p>Call us: ((0261) 253 772)</p>
            //             <p>Visit us: Anonymous Car Share, Sumul Dairy Road</p>
            //         </div>
            //     </div>
            // </div>
            <div className='body'>
                <div className="container">
                    <div className="screen">
                        <div className="screen__content">
                            {this.state.errorMessage && <Alert style={{ background: "linear-gradient(90deg, #C7C5F4, #776BCC" }} variant="danger">
                                <Alert.Heading>Login failed!</Alert.Heading>
                                <p>
                                    {this.state.errorMessage}
                                </p>
                            </Alert>}
                            <Form style={{ paddingTop: "100px" }} onSubmit={this.handleSubmit} id="signup_form" >
                                <Form.Group as={Row} controlId="formHorizontalEmail" className='login__field'>
                                    {/* <Form.Label column sm={2}>
                                    Email
                                </Form.Label> */}
                                    <div style={{ margin: "auto", width: "300px" }}>
                                        <div className='login__icon'>
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <Form.Control style={{ border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "75%", transition: ".2s" }} name="email" type="email" placeholder="Email" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    {/* <Col sm={10}>
                                    </Col> */}
                                </Form.Group>

                                <Form.Group as={Row} controlId="formHorizontalPassword" className='login__field'>
                                    {/* <Form.Label column sm={2}>
                                    Password
                                </Form.Label> */}
                                    <div style={{ margin: "auto", width: "300px" }}>
                                        <div className='login__icon'>
                                            <FaLock />
                                        </div>
                                        <div>

                                            <Form.Control style={{ border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "75%", transition: ".2s" }} name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    {/* <Col sm={10}>
                                    </Col> */}
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Col sm={{ span: 9, offset: 2 }}>
                                        <Button type="submit" style={{ background: "#fff", fontSize: "14px", margintop: "30px", padding: "16px 20px", borderRadius: "26px", border: "1px solid #D4D3E8", textTransform: "uppercase", fontWeight: "700", display: "flex", alignItems: "center", width: "100%", color: "#4C489D", boxshadow: "0px 2px 2px #5C5696", cursor: "pointer", transition: ".2s" }}>Login
                                            <div className='button__icon'>
                                                <FaChevronRight />
                                            </div>
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="screen__background">
                            <span className="screen__background__shape screen__background__shape4"></span>
                            <span className="screen__background__shape screen__background__shape3"></span>
                            <span className="screen__background__shape screen__background__shape2"></span>
                            <span className="screen__background__shape screen__background__shape1"></span>
                        </div>
                    </div>
                </div>
                <div className="footer-parent" style={{ paddingTop: "50px" }}>
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

export default LoginPage;
