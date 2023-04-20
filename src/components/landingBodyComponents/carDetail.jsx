import React, { Component } from "react";
import SimpleImageSlider from "react-simple-image-slider";
import { Card } from "antd";
import '../../styles/carDetail.css';

class carDetail extends Component {

    render() {
        const { car } = this.props.location.state;
        console.log(car);

        return (
            <div className="cardetail_con" style={{ marginLeft: "2%" }}>
                <div style={{ display: "flex", marginTop: "1%" }}>
                    <div style={{ marginTop: "10px", height: "30px", width: "3px", background: "linear-gradient(315deg, #ffbc00, #ff0058)" }}></div>
                    <div className="car_title">{car.make}</div>
                </div>

                <div style={{ display: "flex" }}>
                    <div style={{ width: "60%", height: "70%" }}>
                        <SimpleImageSlider
                            width="60%"
                            height="70%"
                            images={car.image.map((images, index) =>
                                images
                            )
                            }
                            showBullets={true}
                            showNavs={true}
                            // autoPlay
                            style={{
                                borderTopLeftRadius: "8px", borderTopRightRadius: "8px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                            }}
                        />
                    </div>
                    <div style={{ marginLeft: "5%" }}>
                        <Card
                            hoverable
                            style={{
                                width: 300,
                                height: 250,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0
                            }}
                        >
                            <div style={{ display: "flex" }}>
                                <div style={{ marginLeft: "-20px", marginTop: "3px", height: "13px", width: "3px", background: "linear-gradient(315deg, #ffbc00, #ff0058)" }}></div>
                                <div style={{ marginLeft: "15px" , fontWeight:"bolder" }}>SPECIFICATIONS</div>
                                <div style={{ display: "block" }}>
                                    <div style={{ marginLeft: "10px", marginTop: "6px", height: "1px", width: "25px", background: "linear-gradient(315deg, #ffbc00, #ff0058)" }}></div>
                                    <div style={{ marginLeft: "10px", marginTop: "7px", height: "1px", width: "40px", background: "linear-gradient(315deg, #ffbc00, #ff0058)" }}></div>
                                </div>
                            </div>
                            <div>
                                <div>Make:<strong>{car.make}</strong></div>
                                <div>Number-plate:<strong>{car.numberplate}</strong></div>
                                <div>Registration dates:<strong>2001</strong></div>
                                <div>Transmission:<strong>Manual Transmission</strong></div>
                                <div>Body-type:<strong>{car.bodytype}</strong></div>
                                <div>Exterior-Color:<strong>{car.colour}</strong></div>
                                <div>Number of seats:<strong>{car.seats}</strong></div>
                                <div>Fuel-type:<strong>{car.fueltype}</strong></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default carDetail;