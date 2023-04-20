/* Cars component in landing page */
import React, { Component } from 'react'
import CarServiceApi from '../../api/CarServiceApi.js';
import LocationServiceApi from '../../api/LocationServiceApi.js';
import { Row, Container } from 'react-bootstrap';
import '../../styles/cars.css';
import CarDescriptionComponent from './CarDescriptionComponent.jsx';

export default class Cars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: []
        };
    }

    componentDidMount() {
        // obtain all cars
        CarServiceApi.getAllCars().then(res => {
            // console.log(res.data)
            res.data.cars.forEach(car => {
                LocationServiceApi.getLocationFromId(car.location).then(res => {
                    car.location = res.data.name
                    car.locationId = res.data._id
                    this.state.cars.push(car);
                    this.setState({
                        cars: this.state.cars
                    });
                });
            });
        });
    }

    render() {
        return (
            <section className="section-item">
                <div>
                    <h2 className='listCar_title'>Our cars</h2>
                    <Container fluid style={{ marginTop:"5%"}}>
                        <Row>
                            {
                                this.state.cars.map(car => <CarDescriptionComponent car={car} key={car.id} />)
                            }
                        </Row>
                    </Container>
                </div>
            </section>
        );
    }
}