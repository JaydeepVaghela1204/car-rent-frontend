/* Booking service APIs */
import axios from 'axios';
import UserServiceApi from './UserServiceApi';

const api_url = process.env.REACT_APP_BOOKING_URL

class BookingServiceApi {
    getNextBooking() {
        return axios.get(`${api_url}/customers/next`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    createBooking(booking) {
        return axios.post(api_url, booking);
    }

    getUserBookings(userId) {
        return axios.get(`${api_url}/customers/all/${userId}`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    getUserBooking(bookingId) {
        return axios.get(`${api_url}/customers/${bookingId}`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    modifyBooking(booking) {
        return axios.patch(`${api_url}/customers/${booking.id}`, booking);
    }

    getAllBookings() {
        return axios.get(`${api_url}/customers/all`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }

    getBooking(bookingId) {
        return axios.get(`${api_url}/${bookingId}`, { headers: { authorization: UserServiceApi.getUserToken() } });
    }
}

export default new BookingServiceApi();
