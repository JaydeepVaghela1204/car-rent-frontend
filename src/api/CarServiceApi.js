/* Car service APIs */
import axios from 'axios';

const api_url = process.env.REACT_APP_CAR_URL

class CarServiceApi {
    createNewCar(newCar) {
        return axios.post(api_url, newCar);
    }

    getAllCars() {
        return axios.get(api_url);
    }

    getCar(carId) {
        return axios.get(`${api_url}/${carId}`);
    }

    searchAvailableCars(search) {
        return axios.post(api_url + '/availability', search);
    }

    filterCars(filter) {
        return axios.post(api_url + '/filter', filter);
    }

    updateCar(car) {
        return axios.patch(api_url + `/${car._id}`, car);
    }
}

export default new CarServiceApi();
