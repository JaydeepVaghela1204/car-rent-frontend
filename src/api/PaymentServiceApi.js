import axios from 'axios';
import UserServiceApi from './UserServiceApi';

const api_url = process.env.REACT_APP_PAYMENT_URL

class PaymentServiceApi {
    createPayment(booking) {
        return axios.post(`${api_url}/create`, booking);
    }

    getAllPayments() {
        return axios.get(`${api_url}`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }
}

export default new PaymentServiceApi();