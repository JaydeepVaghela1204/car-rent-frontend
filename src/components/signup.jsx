/* Signup page */
import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js';
import '../styles/signup.css';
import { FaUser, FaEnvelope, FaLock, FaChevronRight } from 'react-icons/fa';
// import Footer from './footer.jsx';

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleFirstName = this.handleFirstName.bind(this);
    }

    /* Set react state for each input when user inputs something on signup form */

    // handleFirstName = event => {
    //     const letters = /^[A-Za-z]+$/;
    //     if (event.target.value.match(letters)) {
    //         return true;
    //     }
    //     else {
    //         alert("message");
    //         return false;
    //     }
    // }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        /* create new user object */
        let newUser = {
            firstname: this.state.firstname.trim(),
            lastname: this.state.lastname.trim(),
            email: this.state.email,
            password: this.state.password,
            usertype: "customer",
            // usertype: "admin"
            // usertype: "staff"
        };
        // input validation
        const letters = /^[A-Za-z]+$/;
        if (this.state.firstname === '') {
            return this.setState({ errorMessage: "First name can't be empty!" });
        }
        else {
            if (!this.state.firstname.match(letters)) {
                return this.setState({ errorMessage: "First name accept only letters!" });
            }
        }
        if (this.state.lastname === '') {
            return this.setState({ errorMessage: "Last name can't be empty!" });
        }
        else {
            if (!this.state.lastname.match(letters)) {
                return this.setState({ errorMessage: "Last name accept only letters!" });
            }
        }
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state.email === '') {
            return this.setState({ errorMessage: "E-mail can't be empty!" });
        }
        else {
            if (!emailRegex.test(String(this.state.email).toLowerCase())) {
                return this.setState({ errorMessage: "Please enter a valid email!" });
            }
        }
        if (this.state.password === '') {
            return this.setState({ errorMessage: "Password can't be empty!" });
        }
        // publish new user to backend
        UserServiceApi.createNewUser(newUser).then(() => {
            // login user on success
            UserServiceApi.loginUser({ email: this.state.email, password: this.state.password }).then(res => {
                UserServiceApi.registerSuccessfulLoginForJwt(res.data.token);
                window.location.href = `/`;
            })
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message });
        });
    }

    render() {
        return (
            <div className='body'>
                <div className="container">
                    <div className="screen">
                        <div className="screen__content">
                            {this.state.errorMessage && <Alert style={{ background: "linear-gradient(90deg, #C7C5F4, #776BCC" }} variant="danger">
                                <Alert.Heading>Register failed!</Alert.Heading>
                                <p>
                                    {this.state.errorMessage}
                                </p>
                            </Alert>}
                            <Form onSubmit={this.handleSubmit} id="signup_form" >
                                <Form.Group as={Row} controlId="formHorizontalFirstName" className='login__field' >
                                    {/* <Form.Label column sm={2} className='login__field'> */}
                                    {/* </Form.Label> */}
                                    <div style={{ margin: "auto", width: "300px" }}>
                                        <div className='login__icon'>
                                            <FaUser />
                                        </div>
                                        <div>
                                            <Form.Control style={{ border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "75%", transition: ".2s" }} name="firstname" type="firstname" placeholder="First Name" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    {/* <Col sm={10}> */}
                                    {/* </Col> */}
                                </Form.Group>

                                <Form.Group as={Row} controlId="formHorizontalLastName" className='login__field'>
                                    {/* <Form.Label column sm={2}>
                                    Last Name
                                </Form.Label> */}
                                    <div style={{ margin: "auto", width: "300px" }}>
                                        <div className='login__icon'>
                                            <FaUser />
                                        </div>
                                        <div>
                                            <Form.Control style={{ border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "75%", transition: ".2s" }} name="lastname" type="lastname" placeholder="Last Name" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    {/* <Col sm={10}>
                                    </Col> */}
                                </Form.Group>

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

                                            <Form.Control style={{ border: "none", borderBottom: "3px solid #D1D1D4", background: "none", padding: "10px", paddingLeft: "24px", fontWeight: 700, width: "75%", transition: ".2s" }} name="password" type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain: at least one number, one uppercase, lowercase letter, and at least 8 or more characters" placeholder="Password" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    {/* <Col sm={10}>
                                    </Col> */}
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Col sm={{ span: 9, offset: 2 }}>
                                        <Button type="submit" style={{ background: "#fff", fontSize: "14px", margintop: "30px", padding: "16px 20px", borderRadius: "26px", border: "1px solid #D4D3E8", textTransform: "uppercase", fontWeight: "700", display: "flex", alignItems: "center", width: "100%", color: "#4C489D", boxshadow: "0px 2px 2px #5C5696", cursor: "pointer", transition: ".2s" }}>Create Account
                                            <div className='button__icon'>
                                                <FaChevronRight />
                                            </div>
                                        </Button>
                                    </Col>
                                    <Col sm={{ span: 10, offset: 4 }}>
                                        <a style={{ color: "white" }} href="/login">Have an account?</a>
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

export default SignUpPage;